define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    propertyToIdMap: {
      'username': 'signin-username',
      'password': 'signin-password'
    },

    submitOnClick: function(e) {
      e.preventDefault();
      var self = this;

      this.model.signIn(this.getValues());

      this.model.on('signin', function() {
        self.clearForm();
      });
    },

    events: {
      'click .submit' : 'submitOnClick'
    }
  });

});
