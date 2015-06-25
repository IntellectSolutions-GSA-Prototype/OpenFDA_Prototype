// NPM Modules
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Custom OpenFDA Modules
var query = require('./routes/query');

// Setup and configure application
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.compress());

app.use(function(req,res,next) {
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

app.set('json spaces',2);
app.set('json replacer', undefined);

// Define get/post methods accepted by server
app.get('/openfda/listBrandNameOTCDrugs',query.listBrandNameOTCDrugs);
app.get('/openfda/listBrandNamePresDrugs',query.listBrandNamePresDrugs);
app.get('/openfda/listGenericOTCDrugs',query.listGenericNameOTCDrugs);
app.get('/openfda/listGenericPresDrugs',query.listGenericNamePresDrugs);
app.post('/openfda/query',query.openFDA);

// Error Handling
process.on('uncaughtException', function(e) {
	console.log('Uncaught Exception: ' + e);
	//process.exit(1);
});

// Activate Server
var port = process.env.PORT || 8000;
app.listen(port, function() {
	console.log('Listening on ' + port);
});
