OpenFDA Back End API Documentation

Node JS is configured to accept GET/POST requests to specific URL's that facilitate the OpenFDA queries on behalf of users.

There are six valid URL's that the server will accept to the https://openfda.intellectsolutions.com:8000
+ /openfda/listBrandNameOTCDrugs
+ /openfda/listBrandNamePresDrugs
+ /openfda/listGenericOTCDrugs
+ /openfda/listGenericPresDrugs
+ /openfda/clearcache
+ /openfda/query

1. Obtain a Listing of Over the Counter Brand Name Drugs that have Adverse Reactions recorded in OpenFDA Repository
  URL: /openfda/listBrandNameOTCDrugs
  Method: GET
  URL Params: None

  Success Response:
    Code: 200 
    Content: JSON Response Object from OpenFDA for the following query
      /drug/label.json?search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.brand_name.exact

  Error Response:
    Code: 400 Invalid Query Submitted 
    Content: [{"results":"No Response Received"}]

  Sample Call:
    https://openfda.intellectsolutions.com:8000/openfda/listBrandNameOTCDrugs

2. Obtain a Listing of Prescription Brand Name Drugs that have Adverse Reactions recorded in OpenFDA Repository
  URL: /openfda/listBrandNamePresDrugs
  Method: GET
  URL Params: None

  Success Response:
    Code: 200 
    Content: JSON Response Object from OpenFDA for the following query
      /drug/label.json?search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.brand_name.exact

  Error Response:
    Code: 400 Invalid Query Submitted 
    Content: [{"results":"No Response Received"}]

  Sample Call:
    https://openfda.intellectsolutions.com:8000/openfda/listBrandNamePresDrugs
    
3. Obtain a Listing of Over the Counter Generic Drugs that have Adverse Reactions recorded in OpenFDA Repository
  URL: /openfda/listGenericOTCDrugs
  Method: GET
  URL Params: None

  Success Response:
    Code: 200 
    Content: JSON Response Object from OpenFDA for the following query
      /drug/label.json?search=_exists_:adverse_reactions+AND+openfda.product_type=OTC&count=openfda.generic_name.exact

  Error Response:
    Code: 400 Invalid Query Submitted 
    Content: [{"results":"No Response Received"}]

  Sample Call:
    https://openfda.intellectsolutions.com:8000/openfda/listGenericOTCDrugs

4. Obtain a Listing of Prescription Generic Drugs that have Adverse Reactions recorded in OpenFDA Repository
  URL: /openfda/listGenericPresDrugs
  Method: GET
  URL Params: None

  Success Response:
    Code: 200 
    Content: JSON Response Object from OpenFDA for the following query
      /drug/label.json?search=_exists_:adverse_reactions+AND+openfda.product_type=PRESCRIPTION&count=openfda.generic_name.exact

  Error Response:
    Code: 400 Invalid Query Submitted 
    Content: [{"results":"No Response Received"}]

  Sample Call:
    https://openfda.intellectsolutions.com:8000/openfda/listGenericPresDrugs
    
5. A local cache is mainted to for the items 1-4 to reduce the queries submitted to OpenFDA and improve site performance.
    This local cache can be manually reset using the following URL.  After which, the next call for items 1-4 will refresh the cahed response by requerying OpenFDA.
  URL: /openfda/clearcache
  Method: GET
  URL Params: None

  Success Response:
    Code: 200 
    Content: [{"results":"Local Cache Reset"}]

  Error Response:
    None.

  Sample Call:
    https://openfda.intellectsolutions.com:8000/openfda/clearcache
    
6. Query OpenFDA to display results for the website is accomplished through the following URL
  URL: /openfda/query
  Method: GET
  URL Params: JSON Object
  {
    "QueryParameters":
      {
        "queryType":INT,    
        "drugType":INT,
        "drugSource":INT,
        "drugName":STRING,
        "filterIndex":INT
    }
  }
  Valid Parameter Values and Definitions
  Note: Based on Query Type, there are additional required parameters.  Any other parameters sent will not cause a problem, and will be ignored if not required for the query.
  
  queryType:
    1 = List Drugs for Selected Adverse Reaction Filter Index Value
        Requires: filterIndex - Query Type 1 - Adverse Reaction List (see below)
    2 = List Adverse Reactions for Selected Drug and Demographics Filter
        Requires: drugType; drugName; filterIndex - Query Type 2 - Demographics List (see below)
    3 = List Drug Labels for Selected Drug
        Requires: drugType; drugName
        
  drugType:
    0 = Generic
    1 = Brand Name
  
  drugSource:
    0 = Over the Counter
    1 = Prescription
    
  drugName:
    String containing the name of the drug to query
  
  filterIndex:
    Select an integer based on the following Query Types
    Query Type 1 - Adverse Effects List
      0 = Drug Ineffective
      1 = Nausea
      2 = Death
      3 = Headache
      4 = Dysponea
      5 = Pain
      6 = Dizziness 
      7 = Vomiting
      8 = Diarrhoea
      9 = Fatigue
    Query Type 2 - Demographics List
      0 = Any
      1 = Females < 21
      2 = Females 22 - 60
      3 = Females 61 - 90
      4 = Females > 90
      5 = Males < 21
      6 = Males 22 - 60
      7 = Males 61 - 90
      8 = Males > 90
    
  Success Response:
    Code: 200 
    Content: JSON Response Object from OpenFDA for the following query

  Error Response:
    Code: 400 Invalid Query Submitted 
    Content: [{"results":"No Response Received"}]

    Code: 401 No Query Parameters Received
    Content: [{"results":"No Query Parameters Received"}]

    Code: 402 Invalid Query Parameters Submitted 
    Content: [{"results":"Query Parameters not recognized"}]

  Sample Call:
    https://openfda.intellectsolutions.com:8000/openfda/query
    
    Body Contains:
      {"QueryParameters":{"queryType":3,"drugType":1,"drugSource":1,"drugName":"BYETTA","filterIndex":4}}

