define(function(require) {
  var BaseView = require('views/BaseView');
  var _ = require('underscore');

  return BaseView.extend({
    propertyToIdMap: [],

    initialize: function() {
      var self = this;

      // FIXME: Change 'message' to 'notification'
      this.model.on('message', function(model, messages) {
        // FIXME: Set cookie?
        if (messages) {
          self.setMessages(messages);
        }
      });

      this.on('beforeshow', function() {
        self.setMessages([]);
      });

    },

    clearForm: function() {
      var map = this.propertyToIdMap;
      Object.keys(map).forEach(function(prop) {
        var id = map[prop];
        document.getElementById(id).value = '';
      });
      return map;
    },

    getValues: function() {
      var map = $.extend({}, this.propertyToIdMap);
      Object.keys(map).forEach(function(property) {
        var id = map[property];
        map[property] = document.getElementById(id).value;
      });
      return map;
    },

    setMessages: function(messages) {
      messages = _.groupBy(messages, 'type');
      var text = '';
      var $error = this.$el.find('.error-messages');
      var $success = this.$el.find('.success-messages');

      this.$el
        .find('.error-messages, .success-messages')
        .empty();

      if (messages.error) {
        text = _.pluck(messages.error, 'message')
          .forEach(function(text) {
            $error.append($('<li/>').html(text));
          });
        $error.show();
      } else {
        $error.hide();
      }

      if (messages.success) {
        text = _.pluck(messages.success, 'message')
          .forEach(function(text) {
            $success.append($('<li/>').html(text));
          });
        $success.show();
      } else {
        $success.hide();
      }
    }
  });
});
