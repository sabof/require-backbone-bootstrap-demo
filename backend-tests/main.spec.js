/*jshint node:true */

var testUtils = require("./test-utils.js");
var framework = require("../backend/framework.js");
var request = require("supertest");
var app = require("../backend/app.js");

require("../backend/handlers.js");

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

try {
  describe('Stop when not ran from jasmine-node', function () {});
} catch(e) {
  return;
}

//------------------------------------------------------------------------------

describe('/gametitles/list', function() {
  it('should serve a list of game titles', function(done) {
    request(app)
      .get('/gametitles/list')
      .end(function(err, res){
        if (err) throw err;
        expect(res.body.titles.length).toBe(11);
        done();
      });
  });
});

//------------------------------------------------------------------------------

describe('404', function() {
  it('should be shown when a path doen\'t match an API handler or a file', function(done) {
    request(app)
      .get('/i-dont-exist/')
      .expect(200, done);
  });
});

//------------------------------------------------------------------------------

xdescribe('file server', function() {
  it('should serve index.html', function(done) {
    request(app)
      .get('/index.html')
      .expect(200)
      .expect(function(err, res) {
        expect(res.body.match("<html ")).toBeTruthy();
        done();
      });
  });
});

//------------------------------------------------------------------------------

describe('PUT /register/{username}', function() {
  it('Should echo', function(done) {
    request(app)
      .put('/register/test-user')
      .send({ "firstName": "Alex","password":"password" })
    // .expect(200)
      .expect(function(err, res) {
        expect(res.body.firstName).toBe('Alex');
        done();
      });
  });
});
