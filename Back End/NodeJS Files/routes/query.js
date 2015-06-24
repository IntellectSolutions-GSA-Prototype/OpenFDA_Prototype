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

  console.log('Host: ' + options.host);
  console.log('Path: ' + options.path);
  console.log('Method: ' + options.method);

  var req = https.request(options, function(res) {
    console.log(options.host + ':' + res.statusCode);

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

  if(data.QueryType.Index) {
    switch(data.QueryType.Index) {
      case 0:  //Food Recalls
        qString.sPath = '/drug/event.json';
	qString.sQuery = 'search=reason_for_recall:"' + data.Value.replace(/ /g,"+") + '"';
        break;
      case 1:  //Adverse Reactions
        qString.sPath = '/drug/event.json';
	qString.sQuery = 'search=patient.drug.openfda.pharm_class_epc:"' + data.Value.replace(/ /g,"+") + '"';
        break;
      default:
	// Do nothing
	break;
    } 
  }
  return qString; 
}

exports.openFDA = function(req,res) {
  //var data = req.body;
  var data = JSON.parse('{"QueryType":{"Index":1,"Value":"Adverse Reactions"},"Value":"nonsteroidal anti-inflammatory drug"}');

  if(data) {
    console.log('Parameters Received: ' + JSON.stringify(data));
    var searchData = parseParameters(data);
    if (searchData.sPath != '') {
      performRequest(searchData.sPath, searchData.sQuery, function(responseData) {
        if(responseData) {
          console.log('Fetched ' + responseData.length + ' bytes');
          res.json(200,JSON.parse(responseData));
        } else {
          res.write('No response received for query parameters');
        }
      });
    } else {
	res.write('Query Parameters not recognized');
    }
  } else {
    res.write('No query parameters received');
  }
}


