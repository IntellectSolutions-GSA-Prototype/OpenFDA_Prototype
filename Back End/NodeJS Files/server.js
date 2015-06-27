// NPM Modules
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');

// Custom OpenFDA Modules
var query = require('./routes/query');

// Setup and configure application
var appHttps = express();

// Activate Server
console.log("Starting Server...");
var privateKey = fs.readFileSync('/etc/pki/tls/private/myserver.key');
var certificate = fs.readFileSync('/etc/pki/tls/certs/server.crt');
var ca = fs.readFileSync("/etc/pki/tls/certs/comodo-bundle.crt").toString().split("\n");

var httpsOptions = {
  ca: ca,
  key: privateKey,
  cert: certificate,
  honorCipherOrder: true,
  //secureProtocol: "TLS",
  ciphers: "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+ aRS A+SHA256 EECDH !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !DHE !RC4"
};

var httpsServer = https.createServer(httpsOptions, appHttps);

console.log("Starting Listener...");
var port = process.env.PORT || 8000;
httpsServer.listen(port, function() {
	console.log('Listening on ' + port);
});

appHttps.use(logger('dev'));
appHttps.use(bodyParser.json());
appHttps.use(bodyParser.urlencoded({ extended: true }));

appHttps.use(express.compress());

appHttps.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST,GET');

  // intercept non-POST requests
  if (req.method != 'POST' && req.method != 'GET') {
    res.send(200);
  } else {
    next();
  }
});

appHttps.set('json spaces',2);
appHttps.set('json replacer', undefined);

// Define get/post methods accepted by server
appHttps.get('/openfda/clearcache',query.clearCache);
appHttps.get('/openfda/listBrandNameOTCDrugs',query.listBrandNameOTCDrugs);
appHttps.get('/openfda/listBrandNamePresDrugs',query.listBrandNamePresDrugs);
appHttps.get('/openfda/listGenericOTCDrugs',query.listGenericOTCDrugs);
appHttps.get('/openfda/listGenericPresDrugs',query.listGenericPresDrugs);
appHttps.post('/openfda/query',query.openFDA);

// Error Handling
process.on('uncaughtException', function(e) {
	console.log('Uncaught Exception: ' + e);
	//process.exit(1);
});

