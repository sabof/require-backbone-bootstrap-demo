/*jshint node:true */

var http = require('http');
var path = require("path");
var url = require("url");

var express = require('express');
var app = express();

var framework = require("./framework.js");
require("./handlers.js");

var server = http.createServer(framework.mainHandler);
var port = Number(process.env.PORT || 8124);

server.listen(port);
