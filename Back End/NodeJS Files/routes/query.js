var querystring = require('querystring');
var https = require('https');

var host = 'api.fda.gov';
var apiKey = '*****';
var sessionId = null;

function performRequest(apiPath, data, success) {
  var headers = {};
  var method = 'GET';

  // OpenFDA Query Syntax is very particular.  This function assumes
  // data is a string representing a properly formated set of query parameters 
  // OpenFDA query method = GET (POST not supported)
  apiPath += '?' + data;
  
  var options = {
    host: host,
    path: apiPath,
    method: method,
    headers: headers
  };

  messageToConsole('Host: ' + options.host);
  messageToConsole('Path: ' + options.path);
  messageToConsole('Method: ' + options.method);

  var req = https.request(options, function(res) {
    messageToConsole(options.host + ':' + res.statusCode);

    if(res.statusCode == 200) {
      var responseString = '';
      res.setEncoding('utf8');

      // Asynchonise operations handling both data evens and end of stream events
      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        success(responseString);
      });
    } else {
	success(null);
    }
  });

  //req.write(dataString);
  req.end();
}

function parseParameters(data) {
  var qString = {
    sPath: '',
    sQuery: ''
  };

  if(!isNaN(data.QueryType.Index)) {
    messageToConsole('Query Index = ' + data.QueryType.Index);
    switch(data.QueryType.Index) {
      case 0:  //Food Recalls
        qString.sPath = '/drug/event.json';
	qString.sQuery = 'search=reason_for_recall:"' + data.Value.replace(/ /g,"+") + '"';
        break;
      case 1:  //Adverse Reactions
        qString.sPath = '/drug/event.json';
	qString.sQuery = 'search=patient.drug.openfda.pharm_class_epc:"' + data.Value.replace(/ /g,"+") + '"';
        break;
      case 2: //Label Search - Boxed Warnings
	qString.sPath = '/drug/label.json';
	qString.sQuery = 'search=_exists_:boxed_warning';
	break;
      default:
	// Do nothing
	break;
    } 
  }
  return qString; 
}

function messageToConsole (sStr, res) {
  console.log(sStr);
  if(res) {
    res.write(sStr);
  }
}

var cachedResult = '[{"result":""},{"result":""},{"result":""}]';
var resultArray = JSON.parse(cachedResult);

exports.openFDA = function(req,res) {
  var data = req.body;
  //var data = JSON.parse('{"QueryType":{"Index":2,"Value":"Label Search - Boxed Warnings"},"Value":""}');

  if(data.QueryType.Index !== undefined) {
    if(resultArray[data.QueryType.Index].result != "") {
      messageToConsole('Responding from cached value');
      res.json(200,resultArray[data.QueryType.Index]);
    } else {
      messageToConsole('Parameters Received: ' + JSON.stringify(data));
      var searchData = parseParameters(data);
      if (searchData.sPath !== '') {
        performRequest(searchData.sPath, searchData.sQuery, function(responseData) {
          if(responseData) {
            messageToConsole('Fetched ' + responseData.length + ' bytes.  Response cached');
            resultArray[data.QueryType.Index] = JSON.parse(responseData);
            res.json(200,JSON.parse(responseData));
          } else {
            messageToConsole('No response received for query parameters',res);
          }
        });
      } else {
	messageToConsole('Query Parameters not recognized',res);
      }
    }
  } else {
    messageToConsole('No query parameters received',res);
  }
}


