/* jshint node: true */
var klass = require('klass');

module.exports = klass({
  initialize: function(initData) {
    this.data = {
      "password":"password",
      "username":"alex",
      "genderIsFemale":false,
      "age":0,
      "firstName":"alex",
      "lastName":"testuser",
      "notes":null,
      "phoneNumber":"0777999666",
      "userId":"3869cb99-d7de-46e0-b9f5-401b4854ec78"
    };
  }
});
