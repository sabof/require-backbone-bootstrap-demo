define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    initialize: function() {
      var self = this;
      BasePage.prototype.initialize.call(this);

      this.model.on("error invalid", function(model, error) {
        if (typeof error == 'object' && error.responseText) {
          error = (new Function('return ' + error.responseText) ()).msg;
        }
        self.$el.find('.error-message').html(error);
      });

      this.model.on("change", function() {
        self.$el.find('.error-message').html('');
      });
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
