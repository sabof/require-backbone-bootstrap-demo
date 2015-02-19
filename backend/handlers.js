/*jshint node:true */

var data = require('./data.js');
var framework = require('./framework.js');
var app = require('./app.js');
var jsonParser = require('body-parser').json();

// FIXME: Ensure that paths are whole matches

app.get("/gametitles/list", function(req, res) {
  res.json({titles: data.gameTitles});
});

app.put('/register/:tagId', jsonParser, function(req, res) {
  res.json(req.body);
  // res.json({something: 1});
});

framework.registerHandler("GET", "/profile/\\d+/titles", function(req, res) {});
framework.registerHandler("GET", "/profile/\\d+", function(req, res) {});
framework.registerHandler("PUT", "/profile/\\d+", function(req, res) {});
framework.registerHandler("GET", "/signin/{username}/{password}", function(req, res) {});
