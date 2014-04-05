define(function(require) {
  var _ = require('underscore');
  var BaseView = require('views/BaseView');

  return BaseView.extend({
    events: {
      "click .toggle": "toggleFavourite"
    },

    tagName: 'tr',

    template: _.template(
      '<td class="toggle">[F]</td>' +
        '<td><%= name %></td>'
    ),

    isFavourite: function() {
      return this.model.isFavourite();
    },

    toggleFavourite: function() {
      if (this.isFavourite()) {
        this.model.removeFromFavourites();
      } else {
        this.model.addToFavourites();
      }

      // FIXME: Add as an event binding
      // this.render();

    },

    initialize: function() {
      var self = this;

      this.model.bind(
        'favouriteadded favouriteremoved',
        this.render, this
      );

      this.$el.html(
        this.template(
          this.model.toJSON()
        )
      );

    },

    render: function() {
      this.$el.toggleClass(
        'favourite',
        this.isFavourite()
      );
      return this;
    }
  });
});
