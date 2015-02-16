/* jshint node: true */

function MockRes() {
  var body = "";
  var headers = null;
  var statusCode = 0;

  return {
    writeHead: function(statusCode2, headers2) {
      statusCode = statusCode2;
      headers = headers2;
    },
    write: function(string) {
      body += string;
    },
    end: function(string) {
      body += string;
    },
    getBody: function() {
      return body;
    },
    getStatus: function() {
      return statusCode;
    },
    getHead: function() {
      return headers;
    }
  };
}

exports.MockRes = MockRes;
