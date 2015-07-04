/**
 * query.js module supports the ADERS API interface by providing the code execution and
 * OpenFDA query interface support capability from within the NodeJS infrastructure.
 */

/**
 * Global Parameters for the Query.js module.
 */
queryjs = {
  /**
   * printMsg parameter defines whether the messages are printed to the console
   */
  printMsg: true,

  /**
   * Instantiate an instance of the Supporting NodeJS Modules
   */
  https: require('https'),
  fs: require('fs'),
  
  /**
   * Default Values and Parameters for OpenFDA Queries
   */
  openFDA_host: 'api.fda.gov',
  apiKey: '',

  /**
   *  Establish a Cache for the List Queries that do not change
   */
  cacheBrandNameOTC: null,
  cacheBrandNamePres: null,
  cacheGenericOTC: null,
  cacheGenericPres: null,

  /**
   * The following array defines the query parameters to add based on the filter index value
   * submitted for Query Type 1 - listing drug events by drug for a specified adverse effect
   */
  queryFilterType1Query: [
    "patient.reaction.reactionmeddrapt:drug+ineffective", //  0 = Drug Ineffective
    "patient.reaction.reactionmeddrapt:nausea",           //  1 = Nausea
    "patient.reaction.reactionmeddrapt:death",            //  2 = Death
    "patient.reaction.reactionmeddrapt:headache",         //  3 = Headache
    "patient.reaction.reactionmeddrapt:dyspnoea",         //  4 = Dysponea
    "patient.reaction.reactionmeddrapt:pain",             //  5 = Pain
    "patient.reaction.reactionmeddrapt:dizziness",        //  6 = Dizziness 
    "patient.reaction.reactionmeddrapt:vomiting",         //  7 = Vomiting
    "patient.reaction.reactionmeddrapt:diarrhoea",        //  8 = Diarrhoea
    "patient.reaction.reactionmeddrapt:fatigue"           //  9 = Fatigue
  ],

  /**
   * The following array defines the query parameters to add based on the filter index value
   * submitted for Query Type 2 - List Adverse effects for specified drug for given demographics
   */
  queryFilterType2Query: [
    "",                                                             // 0 = Any
    "patient.patientsex:2+AND+patient.patientonsetage:[0+TO+21]",   // 1 = Females < 21
    "patient.patientsex:2+AND+patient.patientonsetage:[22+TO+60]",  // 2 = Females 22 - 60
    "patient.patientsex:2+AND+patient.patientonsetage:[60+TO+90]",  // 3 = Females 61 - 90
    "patient.patientsex:2+AND+patient.patientonsetage:[91+TO+200]", // 4 = Females > 90
    "patient.patientsex:1+AND+patient.patientonsetage:[0+TO+21]",   // 5 = Males < 21
    "patient.patientsex:1+AND+patient.patientonsetage:[22+TO+60]",  // 6 = Males 22 - 60
    "patient.patientsex:1+AND+patient.patientonsetage:[60+TO+90]",  // 7 = Males 61 - 90
    "patient.patientsex:1+AND+patient.patientonsetage:[91+TO+200]"  // 8 = Males > 90
   ],

  /**
   * The following array defines the query parameters to add based on the Drug Name Type index value
   * submitted for a Query.
   */
  queryDrugNameField: [
    "patient.drug.openfda.brand_name.exact",  //  0 = Brand Name
    "patient.drug.openfda.generic_name.exact" //  1 = Generic
  ],

  /**
   * The following array defines the query parameters to add based on the Drug Product Type index value
   * submitted for a Query.
   */
  queryDrugProductType: [
    "patient.drug.openfda.product_type:otc",          // 0 = Over the Counter
    "patient.drug.openfda.product_type:prescription"  // 1 = Prescription
  ],

  /**
   * OpenFDA Query Parameters for listing brand name over the counter drugs with adverse reactions
   */
  queryListBrandNameOTC: {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.brand_name.exact'
  },

  /**
   * OpenFDA Query Parameters for listing brand name prescription drugs with adverse reactions
   */
  queryListBrandNamePres: {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.brand_name.exact'
  },

  /**
   * OpenFDA Query Parameters for listing generic over the counter drugs with adverse reactions
   */
  queryListGenericOTC: {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.generic_name.exact'
  },

  /**
   * OpenFDA Query Parameters for listing generic prescription drugs with adverse reactions
   */
  queryListGenericPres: {
    sPath: '/drug/label.json',
    sQuery: 'search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.generic_name.exact'
  }
};

/**
 * Populate the queryjs Cache Parameters with the OpenFDA result sets used to generate the web interface list drop downs
 */

if (queryjs.fs.existsSync('/var/certs/api.key')) {
  queryjs.apiKey = 'api_key=' + queryjs.fs.readFileSync('/var/certs/api.key').toString().replace(/(\r\n|\n|\r)/gm,"") + '&';
  queryjs.queryListBrandNameOTC.sQuery = queryjs.apiKey + queryjs.queryListBrandNameOTC.sQuery;
  queryjs.queryListBrandNamePres.sQuery = queryjs.apiKey + queryjs.queryListBrandNamePres.sQuery;
  queryjs.queryListGenericOTC.sQuery = queryjs.apiKey + queryjs.queryListGenericOTC.sQuery;
  queryjs.queryListGenericPres.sQuery = queryjs.apiKey + queryjs.queryListGenericPres.sQuery;
}

performRequest(queryjs.queryListBrandNameOTC, function(responseData) { 
  if(responseData) {
    printMsg('Caching BrandName OTC List');
    queryjs.cacheBrandNameOTC = responseData; 
  } else {
    printMsg('Unable to Cache BrandName OTC List');
  }
});

performRequest(queryjs.queryListBrandNamePres, function(responseData) { 
  if(responseData) {
    printMsg('Caching BrandName Prescription List');
    queryjs.cacheBrandNamePres = responseData; 
  } else {
    printMsg('Unable to Cache BrandName Prescription List');
  }
});

performRequest(queryjs.queryListGenericOTC, function(responseData) { 
  if(responseData) {
    printMsg('Caching Generic OTC List');
    queryjs.cacheGenericOTC = responseData; 
  } else {
    printMsg('Unable to Cache Generic OTC List');
  }
});

performRequest(queryjs.queryListGenericPres, function(responseData) { 
  if(responseData) {
    printMsg('Caching Generic Prescription List');
    queryjs.cacheGenericPres = responseData; 
  } else {
    printMsg('Unable to Cache Generic Prescription List');
  }
});

/**
 * performRequest - Function to submit the search parameters to the OpenFDA API interface and return the resulting JSON response.
 * @params {object} Parameter object containing sPath and sQuerey parameters for submission to OpenFDA API interface.
 *   OpenFDA Query Syntax is very particular.  This function assumes data is a string representing a properly formatted set of query parameters 
 *   OpenFDA query method = GET (POST not supported)
 * @success {object} JSON Object response from OpenFDA API or empty if any errors are encountered during processing.
 */
function performRequest(params, success) {
  var headers = {};
  var method = 'GET';

  var apiPath = params.sPath + '?' + params.sQuery;
  
  var options = {
    host: queryjs.openFDA_host,
    path: apiPath,
    method: method,
    headers: headers
  };

  printMsg('Host: ' + options.host);
  printMsg('Path: ' + options.path);
  printMsg('Method: ' + options.method);

  var req = queryjs.https.request(options, function(res) {
    printMsg('OpenFDA Query Response: ' + res.statusCode);

    if(res.statusCode == 200) {
      var responseString = '';
      res.setEncoding('utf8');

      // Asynchronous operations handling both data evens and end of stream events
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
  req.end();
}

/**
 * parseParameters - Function to process the search parameters JSON object from the front end interface and create the associated
 *   Query Parameter function sPath and sQuery objects for use in the processRequest method.
 * @queryParams {object} JSON object submitted from web interface.
 *   Example: {"QueryParameters":{"queryType":3,"drugType":1,"drugSource":1,"drugName":"BYETTA","filterIndex":4}}
 * @return {object} Query Parameter object containing the formatted sPath and sQuery strings for submission to OpenFDA API
 */
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
        qParams.sQuery = queryjs.apiKey + 'search=' + queryjs.queryFilterType1Query[queryParams.filterIndex];
        qParams.sQuery += '+AND+' + queryjs.queryDrugProductType[queryParams.drugSource];
        qParams.sQuery += '&count=' + queryjs.queryDrugNameField[queryParams.drugType];
      break;
      case 2:  // Adverse effects for specified drug and demographics
        if(isNaN(queryParams.filterIndex) || isNaN(queryParams.drugType) || queryParams.drugName === undefined) {
          // Required Query Parameters are not present
          break;
        }
        qParams.sPath = '/drug/event.json';
        if(queryParams.drugType === 0) {
          qParams.sQuery = queryjs.apiKey + 'search=patient.drug.openfda.brand_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        } else {
          qParams.sQuery = queryjs.apiKey + 'search=patient.drug.openfda.generic_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        }
        if(queryParams.filterIndex > 0 && queryParams.filterIndex < queryjs.queryFilterType2Query.length) {
          qParams.sQuery += '+AND+' + queryjs.queryFilterType2Query[queryParams.filterIndex];
        }
        qParams.sQuery += '&count=patient.reaction.reactionmeddrapt.exact';
        break;
      case 3: // Label Search
        if(isNaN(queryParams.drugType) || queryParams.drugName === undefined) {
          // Required Query Parameters are not present
          break;
        }
        qParams.sPath = '/drug/label.json';
        if(queryParams.drugType === 0) {
          qParams.sQuery = queryjs.apiKey + 'search=openfda.brand_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        } else {
          qParams.sQuery = queryjs.apiKey + 'search=openfda.generic_name:' + (queryParams.drugName).replace(/\s+/g,"+");
        }
        break;
      default:
        // Do nothing: Unknown Query Type Submitted
        break;
    }
  }
  return qParams; 
}

/**
 * printMsg - Function to print debug and other messages to the console.
 * @sStr {string} String to display to the console.
 */
function printMsg (sStr) {
  if(queryjs.printMsg) { console.log(timeStamp() + ' | ' + sStr); }
}

/**
 * timeStamp - Function to return the current timestamp in yyyy-mm-dd hh:mm:ss format.
 * @return {string} String containing current timestamp in yyyy-mm-dd hh:mm:ss format.
 */
function timeStamp() {
   // Create a date object with the current time
   var now = new Date();
    
   // Create an array with the current month, day and time
   var date = [ 
     now.getFullYear(), 
     now.getMonth()<10?"0"+now.getMonth():now.getMonth(), 
     now.getDate()<10?"0"+now.getDate():now.getDate() 
   ];
       
   // Create an array with the current hour, minute and second (Military Format)
   var time = [ 
     now.getHours()<10?"0"+now.getHours():now.getHours(), 
     now.getMinutes()<10?"0"+now.getMinutes():now.getMinutes(), 
     now.getSeconds()<10?"0"+now.getMinutes():now.getSeconds() 
   ];
          
   // Return the formatted string
   return date.join("-") + " " + time.join(":");
}

/**
 * processOpenFDAResponse - Function to analyse the response data received and return to the caller either a HTTP 200 or 400 response
 *   with the associated JSON data object.
 * @response {object} HTTP response object to return data to requester.
 * @responseData {object} JSON Object with data received from OpenFDA API query.
 */
function processOpenFDAResponse(response, responseData) {
  if(responseData) {
    response.json(200,responseData);
  } else {
    printMsg('No response received for query parameters');
    response.json(400,JSON.parse('[{"results":"No Response Received"}]'));
  }
}

/**
 * exports.listBrandNameOTCDrugs - API interface function implementation to return a list of brand name 
 *   over the counter drugs with adverse effects. 
 * @req {object} HTTP request object to submitted from requester.
 * @res {object} HTTP response object to provide data back to requester.
 */
exports.listBrandNameOTCDrugs = function(req,res) {
  if(queryjs.cacheBrandNameOTC) {
    printMsg('Using Cached BrandName OTC Data');
    res.json(200,queryjs.cacheBrandNameOTC);
  } else {
    performRequest(queryjs.queryListBrandNameOTC, function(responseData) {
      processOpenFDAResponse(res,responseData)
      queryjs.cachBrandNameOTC = responseData;
    });
  }
}

/**
 * exports.listBrandNamePresDrugs - API interface function implementation to return a list of brand name  
 *   prescription drugs with adverse effects.
 * @req {object} HTTP request object to submitted from requester.
 * @res {object} HTTP response object to provide data back to requester.
 */
 exports.listBrandNamePresDrugs = function(req,res) {
  if(queryjs.cacheBrandNamePres) {
    printMsg('Using Cached BrandName Prescription Data');
    res.json(200,queryjs.cacheBrandNamePres);
  } else {
    performRequest(queryjs.queryListBrandNamePres, function(responseData) {
      processOpenFDAResponse(res,responseData);
      queryjs.cacheBrandNamePres = responseData;
    });
  }
}

/**
 * exports.listGenericOTCDrugs - API interface function implementation  to return a list of generic 
 *   over the counter drugs with adverse effects. 
 * @req {object} HTTP request object to submitted from requester.
 * @res {object} HTTP response object to provide data back to requester.
 */
exports.listGenericOTCDrugs = function(req,res) {
  if(queryjs.cacheGenericOTC) {
    printMsg('Using Cached Generic OTC Data');
    res.json(200,queryjs.cacheGenericOTC);
  } else {
    performRequest(queryjs.queryListGenericOTC, function(responseData) {
      processOpenFDAResponse(res,responseData);
      queryjs.cacheGenericOTC = responseData;
    });
  }
}

/**
 * exports.listGenericPresDrugs - API interface function implementation to return a list of generic  
 *   prescription drugs with adverse effects..
 * @req {object} HTTP request object to submitted from requester.
 * @res {object} HTTP response object to provide data back to requester.
 */
exports.listGenericPresDrugs = function(req,res) {
  if(queryjs.cacheGenericPres) {
    printMsg('Using Cached Generic Prescription Data');
    res.json(200,queryjs.cacheGenericPres);
  } else {
    performRequest(queryjs.queryListGenericOTC, function(responseData) {
      processOpenFDAResponse(res,responseData);
      queryjs.cacheGenericPres = responseData;
    });
  }
}

/**
 * exports.clearCache - API interface function implementation to clear the current cache for list objects.
 * @req {object} HTTP request object to submitted from requester.
 * @res {object} HTTP response object to provide data back to requester.
 */
exports.clearCache = function(req,res) {
  queryjs.cacheBrandNameOTC = null;
  queryjs.cacheBrandNamePres = null;
  queryjs.cacheGenericOTC = null;
  queryjs.cacheGenericPres = null;
  res.send(200,JSON.parse('[{"results":"Local Cache Reset"}]'));
}

/**
 * exports.openFDA - API interface function implementation to submit queries to the OpenFDA API interface.
 * @req {object} HTTP request object to submitted from requester.
 *   Request object body is expected to contain a JSON object containing the query parameters.
 *   Example: {"QueryParameters":{"queryType":3,"drugType":1,"drugSource":1,"drugName":"BYETTA","filterIndex":4}}
 * @res {object} HTTP response object to provide data back to requester.
 */
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


