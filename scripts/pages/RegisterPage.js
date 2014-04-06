define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    initialize: function() {
      var self = this;
      BasePage.prototype.initialize.call(this);
    },

    events: {
      'click .submit' : 'submitOnClick'
    },

    submitOnClick: function(e) {
      e.preventDefault();

      this.model.register({
        username: $('#register-username').val(),
        firstName: $('#register-first-name').val(),
        lastName: $('#register-last-name').val(),
        password: $('#register-password').val(),
        phoneNumber: $('#register-phone-number').val()
      });
    }

  });
});
