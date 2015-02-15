/*jshint node:true */

var testUtils = require("./test-utils.js");
var framework = require("../backend/framework.js");
require("../backend/handlers.js");

//------------------------------------------------------------------------------
var mockRes = new testUtils.MockRes();

framework.mainHandler({
  url: '/IDontExist',
  method: 'GET'
}, mockRes);
//------------------------------------------------------------------------------

try {
  describe('Stop when not ran from jasmine-node', function () {});
} catch(e) {
  return;
}

//------------------------------------------------------------------------------

describe('/gametitles/list', function() {
  it('should serve a list of game titles', function() {
    var mockRes = new testUtils.MockRes();

    framework.mainHandler({
      url: '/gametitles/list',
      method: 'GET'
    }, mockRes);

    JSON.parse(mockRes.getBody());
    expect(mockRes.getBody().match("Eyepet & Friends")).toBeTruthy();
  });
});

describe('404', function() {
  it('should be shown when a path doen\'t match an API handler or a file', function() {
    var mockRes = new testUtils.MockRes();

    framework.mainHandler({
      url: '/IDontExist',
      method: 'GET'
    }, mockRes);

    expect(mockRes.getBody()).toBeTruthy();
    expect(mockRes.getBody().match("404")).toBeTruthy();
  });
});
