define(function(require) {
  var TitlesCollection = require('models/TitlesCollection');
  var $ = require('jquery');
  var _ = require('underscore');

  return TitlesCollection.extend({
    url: function() {
      var root = this.appModel.currentUser.url();
      return root + '/titles';
    },

    initialize: function() {
      var self = this;

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function(model, value) {
          if (value) {
            self.getTitles();
          } else {
            var models = self.map(function(model) {
              return self.appModel.availableTitles.getModelById(
                model.get('id')
              );
            });

            self.reset([]);

            _.invoke(models, 'trigger', 'favouriteremoved');

          }
        }
      );
    },

    getTitles: function() {
      var self = this;

      var sessionId = this.appModel.currentSession.get('sessionId');
      return this.fetch({
        headers: { sessionId: sessionId },
        success: function() {
          // FIXME: Move to Titles
          var favouriteIds = self.models.map(function(it) {
            return it.get('id');
          });
        }
      });
    },

  });

});
