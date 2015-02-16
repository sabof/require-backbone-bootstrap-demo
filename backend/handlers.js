/*jshint node:true */

var data = require('./data.js');
var framework = require('./framework.js');

// FIXME: Ensure that paths are whole matches

framework.registerHandler("GET", "/gametitles/list", function(req, res) {
  framework.serveJSON(res, {titles: data.gameTitles});
});

framework.registerHandler("GET", "/profile/\\d+/titles", function(req, res) {});
framework.registerHandler("GET", "/profile/\\d+", function(req, res) {});
framework.registerHandler("PUT", "/profile/\\d+", function(req, res) {});
framework.registerHandler("GET", "/signin/{username}/{password}", function(req, res) {});
framework.registerHandler("PUT", "/register/.+", function(req, res) {
  console.log('register');
  console.log(req.trailers);
  console.log(req.body);
  res.end();
});
