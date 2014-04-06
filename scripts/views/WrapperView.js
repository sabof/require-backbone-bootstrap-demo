define(function(require) {
  var BaseView = require('views/BaseView');

  return BaseView.extend({
    initialize: function() {
      var self = this;

      this.model.currentSession.bind(
        'signin signout',
        this.render, this
      );

      this.render();
      var navbar = this.$el.find('#main-navigation').show();
    },

    events: {
      'click #button-signout' : 'signOutOnClick'
    },

    signOutOnClick: function(e) {
      e.preventDefault();
      this.model.currentSession.signOut();
    },

    render: function() {
      var navbar = this.$el.find('#main-navigation');

      navbar.find('li').show();

      if (this.model.currentSession.isSignedIn()) {
        navbar
          .find('a[href=#page-signin], a[href=#page-register]')
          .parent()
          .hide();
      } else {
        navbar
          .find('a[href=#page-user-details], #button-signout')
          .parent()
          .hide();
      }

    }

  });
});
