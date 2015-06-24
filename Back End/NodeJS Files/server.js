// NPM Modules
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Custom OpenFDA Modules
var drugs = require('./routes/drugs');
var query = require('./routes/query');

// Setup and configure application
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.compress());
app.set('json spaces',2);
app.set('json replacer', undefined);

// Define get/post methods accepted by server
//app.get('/openfda/drugs', drugs.findByName);
app.post('/openfda',query.openFDA);
app.post('/openfda/drugs', drugs.findByName);

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
