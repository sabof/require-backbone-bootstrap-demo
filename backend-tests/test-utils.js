/* jshint node: true */

function MockRes() {
  var body = "";
  var head = null;
  var status = 0;

  return {
    writeHead: function(statusCode, params) {
      status = statusCode;
      head = params;
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
      return status;
    },
    getHead: function() {
      return head;
    }
  };
}

exports.MockRes = MockRes;
