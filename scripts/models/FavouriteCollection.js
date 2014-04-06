define(function(require) {
  var TitlesCollection = require('models/TitlesCollection');
  var $ = require('jquery');
  var _ = require('underscore');

  return TitlesCollection.extend({
    url: function() {
      var root = this.appModel.currentUser.url();
      return root + '/titles';
    },

    getTwin: function(model) {
      return this.appModel.availableTitles.getModelById(
        model.get('id')
      );
    },

    initialize: function() {
      var self = this;

      this.on('remove', function(model) {
        this.getTwin(model).trigger('favouriteremoved');
      });

      this.on('add', function(model) {
        this.getTwin(model).trigger('favouriteadded');
      });

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function(model, value) {
          if (value) {
            self.getTitles();
          } else {
            var models = self.map(self.getTwin, self);
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
        headers: { sessionId: sessionId }
      });
    },

  });

});
