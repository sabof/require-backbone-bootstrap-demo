define(function(require) {
  var BaseCollection = require('models/BaseCollection');
  var TitleModel = require('models/TitleModel');
  var $ = require('jquery');

  return BaseCollection.extend({
    model: function(attrs, options) {
      return new TitleModel(
        attrs,
        $.extend(
          {appModel: options.collection.appModel},
          options
        )
      );
    },

    getModelById: function(id) {
      return this.find(function(model) {
        return model.get('id') === id;
      });
    },

    parse: function(response, options) {
      return response.titles;
    }
  });
});
