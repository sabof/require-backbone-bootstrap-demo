define(function(require) {
  var _ = require('underscore');
  var BaseView = require('views/BaseView');

  return BaseView.extend({
    li: 'li',

    events: {
      "click .favourite": "toggleFavourite"
    },

    template: _.template(
      '<button type="button" class="favourite btn btn-default btn-sm">' +
        '<span class="glyphicon glyphicon-star"></span> Favourite' +
        '</button>' +
        '<h3><%= name %></h3>' +
        '<div class="description"><%= description %></div>'
    ),

    isFavourite: function() {
      return this.model.isFavourite();
    },

    toggleFavourite: function() {
      this.$el.find('button').toggleClass('active');

      if (this.isFavourite()) {
        this.model.removeFromFavourites();
      } else {
        this.model.addToFavourites();
      }
    },

    initialize: function() {
      var self = this;

      this.model.bind(
        'favourite:added favourite:removed',
        this.render, this
      );

      this.$el.html(
        this.template(
          this.model.toJSON()
        )
      );

    },

    render: function() {
      this.$el.find('button').toggleClass(
        'active',
        this.isFavourite()
      );
      return this;
    }
  });
});
