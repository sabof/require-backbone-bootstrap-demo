define(function(require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    extactServerError: function(error) {
      var response = error.responseText;
      // The response is not valid JSON, and sometimes not valid JavaScript
      var message = response.replace(/(^[^"]*")|("[^"]*$)/g, '');
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
