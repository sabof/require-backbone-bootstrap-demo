define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    submitOnClick: function(e) {
      e.preventDefault();

      this.model.signIn({
        username: $('#signin-username').val(),
        password: $('#signin-password').val()
      });

      // var user = this.appModel.currentUser;
      // this.model.fetch(false, {url: );
    },

    initialize: function() {
      var self = this;

      // FIXME: Move to base class?

      this.model.on("change", function() {
        // FIXME: Set cookie?
        self.$el.find('.error-message').html('');
      });

    },

    events: {
      'click .submit' : 'submitOnClick'
    }
  });

});
