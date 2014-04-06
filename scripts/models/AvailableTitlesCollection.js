define(function(require) {
  var TitlesCollection = require('models/TitlesCollection');
  var $ = require('jquery');

  return TitlesCollection.extend({
    url: function() {
      return this.appModel.url() + 'gametitles/list';
    },

    getTitles: function() {
      return this.fetch();
    },

    initialize: function() {
      this.getTitles();
    },
  });
});
