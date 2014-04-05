define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var TitleView = require('views/TitleView');

  return Backbone.View.extend({
    tagName: 'table',

    initialize: function () {
      this.$el.addClass('table');

      // this.model.bind("reset", this.render, this);
      // var self = this;
      // this.model.bind("add", function (wine) {
      //   $(self.el).append(new WineListItemView({model:wine}).render().el);
      // });

      // this.model.bind("reset", this.render, this);
      // this.model.bind("change", this.render, this);

      // FIXME: Change to add?
      this.model.bind("sync", this.render, this);

    },

    render: function (eventName) {
      _.each(this.model.models, function (title) {

        this.$el.append(
          new TitleView({model: title})
            .render()
            .el
        );
      }, this);

      return this;
    },

  });
});
