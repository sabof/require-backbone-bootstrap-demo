define(function(require) {
  var BaseCollection = require('models/BaseCollection');
  var TitleModel = require('models/TitleModel');

  return BaseCollection.extend({
    url: function() {
      return this.appModel.url() + 'gametitles/list';
    },

    model: function(attrs, options) {
      var title = new TitleModel(attrs, options);
      title.appModel = options.collection.appModel;

      return title;
    },

    getTitles: function() {
      // console.log('Retrieved titles');
      return this.fetch();
    },

    initialize: function() {
      var self = this;

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function() {
          // console.log();
          self.getTitles();
        }
      );

    },

    parse: function(response, options) {
      return response.titles;
    }
  });
});
