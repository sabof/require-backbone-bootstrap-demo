/*jshint node:true */

var path = require("path");
var url = require("url");
var fs = require('fs');

var SESSION_TIMEOUT = 15;
var requestHandlers = [];

function serveJSON(res, object) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(object));
}

function serveError(res, code, additionalInfo) {
  var names = {
    403 : "Not Authenticated",
	  404 : "Not Found",
	  500 : "Internal Server Error"
  };

  res.writeHead(code, {
		"Content-Type": "text/plain"
	});

  var body = (
    names[code]
      ? code + ' ' + names[code]
      : code)
        + "\n"
        + (additionalInfo + "\n" || "")
  ;

  console.log(body);
	res.end(body);
}

function fileNameToMimeType(filename) {
  if (/\.js$/.test(filename)) {
    return {"Content-Type": 'text/javascript'};
  }
  if (/\.css$/.test(filename)) {
    return {"Content-Type": 'text/css'};
  }
}

function handleFileRequest(req, res) {
  var uri = url.parse(req.url).pathname;
  var root = path.dirname(__dirname);
  var filename = path.join(root, 'frontend', uri);

  fs.exists(filename, function(exists) {
    if (!exists) {
      serveError(res, 404);
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        serveError(res, 500);
        return;
      }

      res.writeHead(200, fileNameToMimeType(filename));
      res.write(file, "binary");
      res.end();
    });
  });
}

function registerHandler(method, matcher, func) {
  func.method = method;
  func.matcher = matcher;

  // Adding to the beginning, so that in case of an overlap recent additions get
  // precedence

  requestHandlers.unshift(func);
}

function mainHandler(req, res) {
  var requestHandler;
  var method = req.method;
  var url = req.url;

  requestHandlers.some(function(handler) {
    if (
      handler.method === method
        && new RegExp(handler.matcher).test(url)
    ) {
      requestHandler = handler;
      return true;
    }
  });

  if (requestHandler) {
    requestHandler(req, res);
  } else {
    handleFileRequest(req, res);
  }
}

exports.registerHandler = registerHandler;
exports.serveJSON = serveJSON;
exports.mainHandler = mainHandler;
