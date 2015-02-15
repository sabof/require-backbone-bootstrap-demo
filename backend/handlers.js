/*jshint node:true */

var data = require('./data.js');
var framework = require('./framework.js');

var users = [];

framework.registerHandler("GET", "/gametitles/list", function(req, res) {
  framework.serveJSON(res, {titles: data.gameTitles});
});
