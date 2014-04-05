define(function(require) {
  var BaseCollection = require('models/BaseCollection');
  var TitleModel = require('models/TitleModel');

  // FIXME: Merge with AvailableTitlesCollection?
  return BaseCollection.extend({
    initialize: function() {
      var self = this;

      this.on('all', function(event, model, message) {
        console.log('userFavouriteTitlesCollection', event, model, message);
      });

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function(model, value) {
          console.log('favs', value);
          if (value) {
            self.getTitles();
          } else {
            self.reset([]);
          }
        }
      );
    },

    getTitles: function() {
      var self = this;

      // console.log('Retrieved titles');
      var sessionId = this.appModel.currentSession.get('sessionId');
      return this.fetch({
        headers: { sessionId: sessionId },
        success: function() {

          // FIXME: Move to Titles
          var favouriteIds = self.models.map(function(it) {
            return it.get('id');
          });

          // self.models.
        }
      });
    },

    url: function() {
      var root = this.appModel.currentUser.url();
      return root + '/titles';
    },

    parse: function(response, options) {
      return response.titles;
    },

    model: function(attrs, options) {
      var title = new TitleModel(attrs, options);
      title.appModel = options.collection.appModel;
      return title;
    }

  });

});
