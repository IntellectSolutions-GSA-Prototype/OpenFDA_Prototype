var querystring = require('querystring');
var https = require('https');

var host = 'api.fda.gov';
var apiKey = '*****';
var sessionId = null;
var debug = true;

// Query Filter Arrays
// Arrays containing the filter parameters to add to queries based on user selection

// Query Type 1 - List Drug Events by Drug for the specified adverse effect
//   0 = Drug Ineffective
//   1 = Nausea
//   2 = Death
//   3 = Headache
//   4 = Dysponea
//   5 = Pain
//   6 = Dizziness 
//   7 = Vomiting
//   8 = Diarrhoea
//   9 = Fatigue
var queryFilterType1Query = [
  "patient.reaction.reactionmeddrapt:drug+ineffective",
  "patient.reaction.reactionmeddrapt:nausea",
  "patient.reaction.reactionmeddrapt:death",
  "patient.reaction.reactionmeddrapt:headache",
  "patient.reaction.reactionmeddrapt:dysponea",
  "patient.reaction.reactionmeddrapt:pain",
  "patient.reaction.reactionmeddrapt:dizziness",
  "patient.reaction.reactionmeddrapt:vomiting",
  "patient.reaction.reactionmeddrapt:diarrhoea",
  "patient.reaction.reactionmeddrapt:fatigue"
];

// Query Type 2 - List Adverse effects for specified drug for given demographics
//   0 = Any
//   1 = Females < 21
//   2 = Females 22 - 60
//   3 = Females 61 - 90
//   4 = Females > 90
//   5 = Males < 21
//   6 = Males 22 - 60
//   7 = Males 61 - 90
//   8 = Males > 90
var queryFilterType2Query = [
  "",
  "patient.patientsex:2+AND+patient.patientonsetage:[0+TO+21]",
  "patient.patientsex:2+AND+patient.patientonsetage:[22+TO+60]",
  "patient.patientsex:2+AND+patient.patientonsetage:[60+TO+90]",
  "patient.patientsex:2+AND+patient.patientonsetage:[91+TO+200]",
  "patient.patientsex:1+AND+patient.patientonsetage:[0+TO+21]",
  "patient.patientsex:1+AND+patient.patientonsetage:[22+TO+60]",
  "patient.patientsex:1+AND+patient.patientonsetage:[60+TO+90]",
  "patient.patientsex:1+AND+patient.patientonsetage:[91+TO+200]"
 ];

// Drug Display Name Parameters
//   0 = Brand Name
//   1 = Generic
var queryDrugNameField = [
  "patient.drug.openfda.brand_name.exact",
  "patient.drug.openfda.generic_name.exact"
];

// Drug Product Type
//   0 = Over the Counter
//   1 = Prescription
var queryDrugProductType = [
  "patient.drug.openfda.product_type:otc",
  "patient.drug.openfda.product_type:prescription"
];

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
var queryListGenericOTC = {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.generic_name.exact'
  };

// Query Parameters - List of Generic Name Prescription Drugs with Adverse Reactions
var queryListGenericPres = {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.generic_name.exact'
  };

// Cache List Queries that do not change
var cacheBrandNameOTC = null;
var cacheBrandNamePres = null;
var cacheGenericOTC = null;
var cacheGenericPres = null;

performRequest(queryListBrandNameOTC, function(responseData) { 
  if(responseData) {
    printMsg('Caching BrandName OTC List');
    cacheBrandNameOTC = responseData; 
  } else {
    printMsg('Unable to Cache BrandName OTC List');
  }
});

performRequest(queryListBrandNamePres, function(responseData) { 
  if(responseData) {
    printMsg('Caching BrandName Prescription List');
    cacheBrandNamePres = responseData; 
  } else {
    printMsg('Unable to Cache BrandName Prescription List');
  }
});

performRequest(queryListGenericOTC, function(responseData) { 
  if(responseData) {
    printMsg('Caching Generic OTC List');
    cacheGenericOTC = responseData; 
  } else {
    printMsg('Unable to Cache Generic OTC List');
  }
});

performRequest(queryListGenericPres, function(responseData) { 
  if(responseData) {
    printMsg('Caching Generic Prescription List');
    cacheGenericPres = responseData; 
  } else {
    printMsg('Unable to Cache Generic Prescription List');
  }
});

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
        success(JSON.parse(responseString));
      });
    } else {
	success(null);
    }
  });

  //req.write(dataString);
  req.end();
}

function parseParameters(queryParams) {
  var qParams = {
    sPath: '',
    sQuery: ''
  };

  if(!isNaN(queryParams.queryType)) {
    printMsg('Query Index = ' + queryParams.queryType);
    switch(queryParams.queryType) {
      case 1:  // Drugs listed for selected adverse effect
        qParams.sPath = '/drug/event.json';
        qParams.sQuery = 'search=' + queryFilterType1Query[queryParams.filterIndex];
        qParams.sQuery += '+AND+' + queryDrugProductType[queryParams.drugSource];
        qParams.sQuery += '&count=' + queryDrugNameField[queryParams.drugType];
      break;
      case 2:  // Adverse effects for specified drug and demographics
        qParams.sPath = '/drug/event.json';
        qParams.sQuery += 'search=' + queryFilterType2Query[queryParams.filterIndex];
        if(queryParams.drugType === 0) {
	  qParams.sQuery = 'search=patient.drug.openfda.brand_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        } else {
          qParams.sQuery = 'search=patient.drug.openfda.generic_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        }
        if(queryParams.filterIndex > 0) {
          qParams.sQuery += '+AND+' + queryFilterType2Query[queryParams.filterIndex];
        }
        qParams.sQuery += '&count=patient.reaction.reactionmeddrapt.exact';
        break;
      case 3: //Label Search - Boxed Warnings
        qParams.sPath = '/drug/label.json';
        if(queryParams.drugType === 0) {
          qParams.sQuery = 'search=openfda.brand_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        } else {
          qParams.sQuery = 'search=openfda.generic_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        }
	break;
      default:
        // Do nothing: Unknown Query Type Submitted
	break;
    }
  }
  return qParams; 
}

function printMsg (sStr) {
  if(debug) { console.log(timeStamp() + ' | ' + sStr); }
}

/**
 *  Return a timestamp with the format "yyyy-mm-dd HH:mm:ss"
 *  @type {Date}
 *    
 **/
 
function timeStamp() {
// Create a date object with the current time
   var now = new Date();
    
   // Create an array with the current month, day and time
   var date = [ 
     now.getFullYear(), 
     now.getMonth()<10?"0"+now.getMonth():now.getMonth(), 
     now.getDate()<10?"0"+now.getDate():now.getDate() ];
       
   // Create an array with the current hour, minute and second (Military Format)
   var time = [ 
     now.getHours()<10?"0"+now.getHours():now.getHours(), 
     now.getMinutes()<10?"0"+now.getMinutes():now.getMinutes(), 
     now.getSeconds()<10?"0"+now.getMinutes():now.getSeconds() ];
          
   // Return the formatted string
   return date.join("-") + " " + time.join(":");
}

function processOpenFDAResponse(response, responseData) {
  if(responseData) {
    response.json(200,responseData);
  } else {
    printMsg('No response received for query parameters');
    response.json(400,JSON.parse('[{"results":"No Response Received"}]'));
  }
}

exports.listBrandNameOTCDrugs = function(req,res) {
  if(cacheBrandNameOTC) {
    printMsg('Using Cached BrandName OTC Data');
    res.json(200,cacheBrandNameOTC);
  } else {
    printMsg('Brand Name OTC List Request: ' + queryListBrandNameOTC.sPath + '?' + queryListBrandNameOTC.sQuery);
    performRequest(queryListBrandNameOTC, function(responseData) {
      processOpenFDAResponse(res,responseData)
      cachBrandNameOTC = responseData;
    });
  }
}

exports.listBrandNamePresDrugs = function(req,res) {
  if(cacheBrandNamePres) {
    printMsg('Using Cached BrandName Prescription Data');
    res.json(200,cacheBrandNamePres);
  } else {
    performRequest(queryListBrandNamePres, function(responseData) {
      processOpenFDAResponse(res,responseData);
      cacheBrandNamePres = responseData;
    });
  }
}

exports.listGenericOTCDrugs = function(req,res) {
  if(cacheGenericOTC) {
    printMsg('Using Cached Generic OTC Data');
    res.json(200,cacheGenericOTC);
  } else {
    performRequest(queryListGenericOTC, function(responseData) {
      processOpenFDAResponse(res,responseData);
      cacheGenericOTC = responseData;
    });
  }
}

exports.listGenericPresDrugs = function(req,res) {
  if(cacheGenericPres) {
    printMsg('Using Cached Generic Prescription Data');
    res.json(200,cacheGenericPres);
  } else {
    performRequest(queryListGenericOTC, function(responseData) {
      processOpenFDAResponse(res,responseData);
      cacheGenericPres = responseData;
    });
  }
}

exports.clearCache = function(req,res) {
  cacheBrandNameOTC = null;
  cacheBrandNamePres = null;
  cacheGenericOTC = null;
  cacheGenericPres = null;
  res.send(200,JSON.parse('[{"results":"Local Cache Reset"}]'));
}

exports.openFDA = function(req,res) {
  var data = req.body;

  if(data.QueryParameters !== undefined) {
    printMsg('Parameters Received: ' + JSON.stringify(data));
    var searchData = parseParameters(data.QueryParameters);
    if (searchData.sPath !== '') {
      performRequest(searchData, function(responseData) {
        processOpenFDAResponse(res,responseData);
      });
    } else {
      printMsg('Query Parameters not recognized');
      res.json(402,JSON.parse('[{"results":"Query Parameters not recognized"}]'));
    }
  } else {
    printMsg('No query parameters received');
    res.json(401,JSON.parse('[{"results":"No Query Parameters Received"}]'));
  }
}


