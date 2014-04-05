define(function(require) {
  var BaseView = require('views/BaseView');

  return BaseView.extend({
    initialize: function() {
      var self = this;

      this.model.currentSession.bind(
        'signedin signedout',
        this.render, this
      );

      this.render();
    },

    events: {
      'click #button-signout' : 'signOutOnClick'
    },

    signOutOnClick: function(e) {
      e.preventDefault();
      this.model.currentSession.signOut();
    },

    render: function() {
      this.$el.find('li').show();

      if (this.model.currentSession.isSignedIn()) {
        this.$el
          .find('a[href=#page-signin], a[href=#page-register]')
          .parent()
          .hide();
      } else {
        this.$el
          .find('a[href=#page-user-details], #button-signout')
          .parent()
          .hide();
      }
    }

  });
});
