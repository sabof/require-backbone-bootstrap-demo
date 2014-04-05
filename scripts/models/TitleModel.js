define(function(require) {
  var BaseModel = require('models/BaseModel');

  return BaseModel.extend({
    initialize: function() {
      this.on('all', function(event, model, message) {
        console.log('titleModel', event, model, message);
      });

      var self = this;

      // FIXME: Can be optimized
      this.appModel.favouriteTitles.on('add', function(model) {
          if (model.isEqual(self)) {
            self.trigger('favouriteadded');
          }
        });

      this.appModel.favouriteTitles.on('remove', function(model) {
          if (model.isEqual(self)) {
            self.trigger('favouriteremoved');
          }
        });

    },

    url: function() {
      // FIXME: Do I need the full URL?
      // FIXME: How do full urls relate to urlRoot?
      return this.appModel.currentUser.url() +
        '/titles/' + this.get('id');
    },

    defaults: function() {
      return {
	      description: null,
	      name: null,
	      id: null
      };
    },

    isFavourite: function() {
      var self = this;
      var id = self.get('id');
      return !! this.appModel.favouriteTitles.find(function(it) {
        return id === it.get('id');
      });
    },

    isEqual: function(model) {
      return this.get('id') == model.get('id');
    },

    addToFavourites: function() {
      var self = this;
      var sessionId = this.appModel.currentSession.get('sessionId');
      return BaseModel.prototype.sync(
        'update', this, {
          contentType: 'application/json',
          headers: { sessionId: sessionId },
          success: function() {
            // FIXME: Verify data contains a success message
            // FIXME: Verify an item with this Id doesn't already exist

            if (! self.isFavourite()) {
              self.appModel.favouriteTitles.add(self);
              self.trigger('favouriteadded');
              // console.log('Added favourite');
            }
          }
        });
    },

    removeFromFavourites: function() {
      var self = this;
      var sessionId = this.appModel.currentSession.get('sessionId');

      // FIXME: Deletes the model?
      return BaseModel.prototype.sync(
        'delete', this, {
          contentType: 'application/json',
          headers: { sessionId: sessionId },

          success: function() {
            // FIXME: Verify data contains a success message
            var theTitle = self
                  .appModel
                  .favouriteTitles
                  .find(function(it) { return it.id === self.id; });

            if (theTitle) {
              self.appModel.favouriteTitles.remove(theTitle);
              self.trigger('favouriteremoved');
              // console.log('Removed favourite');
            }
          }
        });
    }
  });
});
