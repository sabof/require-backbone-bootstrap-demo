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

    events: {
      'click .submit' : 'submitOnClick'
    }
  });

});
