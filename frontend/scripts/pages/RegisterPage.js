define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    propertyToIdMap: {
      'username': 'register-username',
      'password': 'register-password',
      'lastName': 'register-last-name',
      'firstName': 'register-first-name',
      'phoneNumber': 'register-phone-number',
    },

    initialize: function() {
      var self = this;
      BasePage.prototype.initialize.call(this);

      this.model.on('registration:successful', function() {
        self.clearForm();
      });
    },

    events: {
      'click .submit' : 'submitOnClick'
    },

    submitOnClick: function(e) {
      e.preventDefault();

      this.model.register(
        this.getValues()
      );
    }

  });
});
