define(function(require) {
  var Backbone = require('backbone');

  return Backbone.Collection.extend({
    constructor: function(attrs, opts) {
      if (opts && opts.appModel) {
        this.appModel = opts.appModel;
        delete opts.appModel;
      }

      Backbone.Collection.apply(this, arguments);
    }
  });

});
