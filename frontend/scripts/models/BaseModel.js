define(function(require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    extactServerError: function(error) {
      var response = error.responseText;
      // The response is not valid JSON, and sometimes not valid JavaScript
      var message;
      if (/<html/.test(response)) {
        var el = document.createElement('div');
        el.innerHTML = error.responseText;
        message = $('p, pre', el).text();
      } else {
       message = response.replace(/(^[^"]*")|("[^"]*$)/g, '');
      }
      return message || response.statusText;
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
