define(function(require) {
  var _ = require('underscore');
  var BaseView = require('views/BaseView');

  return BaseView.extend({
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

      this.$el.html(
        this.template(
          this.model.toJSON()
        )
      );

      // FIXME: Move to the Collection?
      this.model.appModel.favouriteTitles.on(
        'add remove', function(model, collection) {
          // console.log('favCha', arguments);
          if (model.isEqual(self.model)) {
            self.render();
          }
        });
    },

    events: {
      "click .toggle": "toggleFavourite"
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
