var querystring = require('querystring');
var https = require('https');

var host = 'api.fda.gov';
var apiKey = '*****';
var sessionId = null;
var debug = true;

// Query Parameters List of Brand Name OTC Drugs with Adverse Reactions
var queryListBrandNameOTC = {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.brand_name.exact'
  };

// Query Parameters - List of Brand Name Prescription Drugs with Adverse Reactions
var queryListBrandNamePres = {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.brand_name.exact'
  };

// Query Parametesr - List of Generic Name OTC Drugs with Adverse Reactions
var queryListGenericNameOTC = {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.generic_name.exact'
  };

// Query Parameters - List of Generic Name Prescription Drugs with Adverse Reactions
var queryListGenericNamePres = {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.generic_name.exact'
  };

function performRequest(params, success) {
  var headers = {};
  var method = 'GET';

  // OpenFDA Query Syntax is very particular.  This function assumes
  // data is a string representing a properly formatted set of query parameters 
  // OpenFDA query method = GET (POST not supported)
  var apiPath = params.sPath + '?' + params.sQuery;
  
  var options = {
    host: host,
    path: apiPath,
    method: method,
    headers: headers
  };

  printMsg('Host: ' + options.host);
  printMsg('Path: ' + options.path);
  printMsg('Method: ' + options.method);

  var req = https.request(options, function(res) {
    printMsg('OpenFDA Query Response: ' + res.statusCode);

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
  var qParams = {
    sPath: '',
    sQuery: ''
  };

  if(!isNaN(data.QueryType.Index)) {
    printMsg('Query Index = ' + data.QueryType.Index);
    switch(data.QueryType.Index) {
      case 0:  //Food Recalls
        qParams.sPath = '/drug/event.json';
	qParams.sQuery = 'search=reason_for_recall:"' + data.Value.replace(/ /g,"+") + '"';
        break;
      case 1:  //Adverse Reactions
        qParams.sPath = '/drug/event.json';
	qParams.sQuery = 'search=patient.drug.openfda.pharm_class_epc:"' + data.Value.replace(/ /g,"+") + '"';
        break;
      case 2: //Label Search - Boxed Warnings
	qParams.sPath = '/drug/label.json';
	qParams.sQuery = 'search=_exists_:boxed_warning';
	break;
      default:
	// Do nothing
	break;
    } 
  }
  return qParams; 
}

function printMsg (sStr, res) {
  if(debug) { console.log(sStr); }
  if(res) { res.write(sStr); }
}

function processOpenFDAResponse(response, responseData) {
  if(responseData) {
    printMsg('Fetched ' + responseData.length + ' bytes.');
    response.json(200,JSON.parse(responseData));
  } else {
    printMsg('No response received for query parameters',response);
  }
}

exports.listBrandNameOTCDrugs = function(req,res) {
  var responseData = {};
  printMsg('Brand Name OTC List Request: ' + queryListBrandNameOTC.sPath + '?' + queryListBrandNameOTC.sQuery);
  performRequest(queryListBrandNameOTC, function(responseData) {
    processOpenFDAResponse(res,responseData);
  });
}

exports.listBrandNamePresDrugs = function(req,res) {
  performRequest(queryListBrandNamePres, function(responseData) {
    processOpenFDAResponse(res,responseData);
  });
}

exports.listGenericNameOTCDrugs = function(req,res) {
  performRequest(queryListGenericNameOTC, function(responseData) {
    processOpenFDAResponse(res,responseData);
  });
}

exports.listGenericNamePresDrugs = function(req,res) {
  performRequest(queryListGenericNameOTC, function(responseData) {
    processOpenFDAResponse(res,responseData);
  });
}

exports.openFDA = function(req,res) {
  var data = req.body;

  if(data.QueryType.Index !== undefined) {
    printMsg('Parameters Received: ' + JSON.stringify(data));
    var searchData = parseParameters(data);
    if (searchData.sPath !== '') {
      performRequest(searchData, function(responseData) {
        processOpenFDAResponse(res,responseData);
      });
    } else {
      printMsg('Query Parameters not recognized',res);
    }
  } else {
    printMsg('No query parameters received',res);
  }
}


