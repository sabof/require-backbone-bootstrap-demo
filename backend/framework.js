/*jshint node:true */

var path = require("path");
var url = require("url");
var fs = require('fs');

var requestHandlers = [];

function serveJSON(res, object) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(object));
}

function serve404(res) {
  res.writeHead(404, {
		"Content-Type": "text/plain"
	});
	res.end("404 Not Found\n");
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
  var uri = url.parse(req.url).pathname,
      filename = path.join(process.cwd(), 'frontend', uri);

  fs.exists(filename, function(exists) {
    if (!exists) {
      serve404(res);
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        return;
      }

      res.writeHead(200, fileNameToMimeType(filename));
      res.write(file, "binary");
      res.end();
    });
  });
}

function registerHandler(method, matcher, func) {
  // Adding to the beginning so that in case of an overlap recent additions get
  // precedence

  requestHandlers.unshift({
    method: method,
    matcher: matcher,
    func: func
  });
}

function mainHandler(req, res) {
  var requestHandler;
  var method = req.method;
  var url = req.url;

  requestHandlers.some(function(handler) {
    if (
      handler.method === method
        && handler.matcher.test(url)
    ) {
      requestHandler = handler;
    }
    return true;
  });

  if (requestHandler) {
    requestHandler(req, res);
  } else {
    handleFileRequest(req, res);
  }
}

exports.registerHandler = registerHandler;
exports.serveJSON = serveJSON;
