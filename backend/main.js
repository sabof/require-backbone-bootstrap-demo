/*jshint node:true */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = require('./app.js');
var framework = require("./framework.js");

require("./handlers.js");
// app.use(express.bodyParser());

console.log(process.env);
app.use(express.static(path.join(__dirname, '../frontend/')));
// Not sure if works
// app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8124, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
