/**
 * server.js module supports the ADERS API interface by instantiating the server interface and the API within the NodeJS infrastructure.
 */

/**
 * Global Parameters for the server.js module.
 */
serverjs = {
  /**
   * Instantiate an instance of the Supporting NodeJS Modules
   */
  express: require('express'),
  logger: require('morgan'),
  bodyParser: require('body-parser'),
  fs: require('fs'),
  https: require('https'),
  query: require('./routes/query'),
  
  /**
   * Instantiate an https options for the server configuration
   */
  httpsOptions: {
    ca: null,
    key: null,
    cert: null,
    honorCipherOrder: true,
    ciphers: "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+ aRS A+SHA256 EECDH !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !DHE !RC4"
  },
  
  /**
   * Initialize placer objects for the web services
   */
  port: process.env.PORT || 8000,
  httpsServer: null
};

/**
 * Initialize and start the server service interface
 */
serverjs.httpsOptions.ca = serverjs.fs.readFileSync("/var/certs/server-ca.crt").toString().split("\n");
serverjs.httpsOptions.key = serverjs.fs.readFileSync('/var/certs/server.key');
serverjs.httpsOptions.cert = serverjs.fs.readFileSync('/var/certs/server.crt');
serverjs.appHttps = serverjs.express();
serverjs.httpsServer = serverjs.https.createServer(serverjs.httpsOptions, serverjs.appHttps);

console.log("Starting Listener...");
serverjs.httpsServer.listen(serverjs.port, function() {
	console.log('Listening on ' + serverjs.port);
});

/**
 * Configure default HTTP request/response handlers and header functions for server interface
 */
serverjs.appHttps.use(serverjs.logger('dev'));
serverjs.appHttps.use(serverjs.bodyParser.json());
serverjs.appHttps.use(serverjs.bodyParser.urlencoded({ extended: true }));
serverjs.appHttps.use(serverjs.express.compress());
serverjs.appHttps.set('json spaces',2);
serverjs.appHttps.set('json replacer', undefined);
serverjs.appHttps.use(function(req,res,next) {
  /**
   * Set Headers to provide handling information for API interface.
   */
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST,GET');

  /**
   * If a request is received that is not supported then gracefully respond to the requestor with a response 200 and end the request processing.
   */
  if (req.method != 'POST' && req.method != 'GET') {
    res.send(200);
  } else {
    next();
  }
});

/**
 * Configure API interface GET/POST requests that are handled by the NodeJS API for ADERS.
 */
serverjs.appHttps.get('/openfda/clearcache',serverjs.query.clearCache);
serverjs.appHttps.get('/openfda/listBrandNameOTCDrugs',serverjs.query.listBrandNameOTCDrugs);
serverjs.appHttps.get('/openfda/listBrandNamePresDrugs',serverjs.query.listBrandNamePresDrugs);
serverjs.appHttps.get('/openfda/listGenericOTCDrugs',serverjs.query.listGenericOTCDrugs);
serverjs.appHttps.get('/openfda/listGenericPresDrugs',serverjs.query.listGenericPresDrugs);
serverjs.appHttps.post('/openfda/query',serverjs.query.openFDA);

/**
 * Establish a catch all error handling routine to prevent errors from shutting down the service.
 */
process.on('uncaughtException', function(e) {
	console.log('Uncaught Exception: ' + e);
});

