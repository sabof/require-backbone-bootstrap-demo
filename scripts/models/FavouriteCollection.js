define(function(require) {
  var BaseCollection = require('models/BaseCollection');
  var TitleModel = require('models/TitleModel');
  var $ = require('jquery');
  var _ = require('underscore');

  // FIXME: Merge with AvailableTitlesCollection?
  return BaseCollection.extend({
    initialize: function() {
      var self = this;

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function(model, value) {
          if (value) {
            self.getTitles();
          } else {
            var modelIds = self.models.map(function(model) {
              return model.get('id');
            });

            var models = self.appModel.availableTitles.models.filter(
              function(model) {
                return modelIds.indexOf(model.get('id')) !== -1;
              });

            self.reset([]);

            _.invoke(models, 'trigger', 'favouriteremoved');

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
      console.log('fc', options.collection.appModel);
      return new TitleModel(
        attrs,
        $.extend(
          {appModel: options.collection.appModel},
          options
        )
      );
    },

  });

});
