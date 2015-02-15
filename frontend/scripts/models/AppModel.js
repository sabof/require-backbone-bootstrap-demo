define(function(require) {
  var BaseModel = require('models/BaseModel');
  var SessionModel = require('models/SessionModel');
  var UserModel = require('models/UserModel');
  var FavouriteCollection = require('models/FavouriteCollection');
  var AvailableTitlesCollection = require('models/AvailableTitlesCollection');

  return BaseModel.extend({
    url: function() {
      return '/';
    },

    registerPage: function(id, page) {
      this.pagesMap[id] = page;
    },

    getPageById: function(id) {
      return this.pagesMap[id];
    },

    initialize: function() {
      this.pagesMap = {};

      this.currentSession = new SessionModel(false, {
        appModel: this
      });

      this.currentUser = new UserModel(false, {
        appModel: this
      });

      this.favouriteTitles = new FavouriteCollection(false, {
        appModel: this
      });

      this.availableTitles = new AvailableTitlesCollection(false, {
        appModel: this
      });

    },
  });
});
