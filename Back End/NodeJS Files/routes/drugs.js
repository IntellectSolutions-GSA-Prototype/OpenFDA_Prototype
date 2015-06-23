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
  var qString = '';

  if(data.search) {
    qString += 'search=' + data.search
  }
  if(data.count) {
    qString += '&count=' + data.count
  }
  return qString;
}

exports.findByName = function(req,res) {
  var data = req.body;
  if(data) {
    console.log('Parameters Received: ' + JSON.stringify(data));
    performRequest('/drug/event.json', parseParameters(data), function(responseData) {
      if(responseData) {
        console.log('Fetched ' + responseData.length + ' bytes');
        res.json(200,JSON.parse(responseData));
      } else {
        res.write('No response received for query parameters');
      }
    });
  } else {
    res.write('No query parameters received')
  }
}


