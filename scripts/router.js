define(function(require) {
  var Backbone = require('backbone');

   return Backbone.Router.extend({
    constructor: function(opts) {
      if (opts && opts.appModel) {
        this.appModel = opts.appModel;
        delete opts.appModel;
      }

      Backbone.Router.apply(this, arguments);
    },

    // appModel: appModel,
    initialize: function() {
      var self = this;
      this.route(/(.*)/, 'mainRoute');
      this.appModel.currentSession.on('signin signout', function() {
        self.normalizePage();
      });
    },

    mainRoute: function(name) {
      if (this.allowedPages().indexOf(name) === -1) {
        window.location = '#' + this.defaultPage();
        return;
      }
      this.setPage(name);
    },

    normalizePage: function() {
      var name = this.currentPage();
      if (this.allowedPages().indexOf(name) === -1) {
        window.location = '#' + this.defaultPage();
      }
    },

    setPage: function(name) {
      $('a[href=#' + name + ']').tab('show');
    },

    currentPage: function() {
      return $('#pages .tab-pane.active').prop('id');
    },

    allowedPages: function() {
      if (this.appModel.currentSession.isSignedIn()) {
        return [
          'page-view-titles',
          'page-user-details'
        ];
      } else {
        return [
          'page-signin',
          'page-view-titles',
          'page-register',
        ];
      }
    },

    defaultPage: function() {
      return this.allowedPages()[0];
    },

   });
});
