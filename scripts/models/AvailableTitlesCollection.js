define(function(require) {
  var BaseCollection = require('models/BaseCollection');
  var TitleModel = require('models/TitleModel');
  var $ = require('jquery');

  return BaseCollection.extend({
    url: function() {
      return this.appModel.url() + 'gametitles/list';
    },

    model: function(attrs, options) {
      return new TitleModel(
        attrs,
        $.extend(
          {appModel: options.collection.appModel},
          options
        )
      );
    },

    getTitles: function() {
      return this.fetch();
    },

    initialize: function() {
      this.getTitles();
    },

    parse: function(response, options) {
      return response.titles;
    }
  });
});
