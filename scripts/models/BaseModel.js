define(function(require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    constructor: function(attrs, opts) {
      if (opts && opts.appModel) {
        this.appModel = opts.appModel;
        delete attrs.appModel;
      }

      Backbone.Model.apply(this, arguments);
    }
  });

});
