define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var TitleView = require('views/TitleView');

  return Backbone.View.extend({
    tagName: 'ol',

    initialize: function () {
      this.$el.addClass('list');

      var self = this;

      this.model.bind("sync", this.render, this);

      this.model.appModel.currentSession.bind('signin', function() {
        self.$el.addClass('show-favourites');
      });

      this.model.appModel.currentSession.bind('signout', function() {
        self.$el.removeClass('show-favourites');
      });

      this.views = [];
    },

    render: function (eventName) {
      _.each(
        this.model.models, function (title) {
          var view = new TitleView({model: title});
          this.views.push(view);

          this.$el.append(view.render().el);
        }, this
      );

      return this;
    },

  });
});
