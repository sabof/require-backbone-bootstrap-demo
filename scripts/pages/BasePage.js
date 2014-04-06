define(function(require) {
  var BaseView = require('views/BaseView');
  var _ = require('underscore');

  return BaseView.extend({
    initialize: function() {
      var self = this;

      // // FIXME: Needed?
      // this.model.on("change", function() {
      //   // FIXME: Set cookie?
      //   self.setMessages([]);
      // });

      // FIXME: Change 'message' to 'notification'
      this.model.on('message', function(model, messages) {
        // FIXME: Set cookie?
        if (messages) {
          self.setMessages(messages);
        }
      });
    },

    setMessages: function(messages) {
      messages = _.groupBy(messages, 'type');
      var text = '';
      var $error = this.$el.find('.error-messages');
      var $success = this.$el.find('.success-messages');

      if (messages.error) {
        text = _.pluck(messages.error, 'message')
          .join('<br/>');
        $error.show().html(text);
      } else {
        $error.hide();
      }

      if (messages.success) {
        text = _.pluck(messages.success, 'message')
          .join('<br/>');
        $success.show().html(text);
      } else {
        $success.hide();
      }
    }
  });
});
