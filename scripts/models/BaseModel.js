define(function(require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    extactServerError: function(error) {
      var message;
      // The response is not valid JSON, and sometimes even not valid JavaScript
      message = error.responseText.substring(6,error.responseText.length - 3);
      return message;
    },

    constructor: function(attrs, opts) {
      if (opts && opts.appModel) {
        this.appModel = opts.appModel;
        delete opts.appModel;
      }

      Backbone.Model.apply(this, arguments);
    }
  });

});
