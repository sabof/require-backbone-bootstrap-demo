define(function(require) {
  var BaseView = require('views/BaseView');
  var _ = require('underscore');

  return BaseView.extend({
    setMessages: function(messages) {
      messages = _.groupBy(messages, 'type');
      var text = '';

      if (messages.error) {
        text = _.pluck(messages.error, 'message');
        this.$el.find('.error-message').show().html(text);
      } else {
        this.$el.find('.error-message').hide();
      }

      if (messages.success) {
        text = _.pluck(messages.success, 'message');
        this.$el.find('.success-message').show().html(text);
      } else {
        this.$el.find('.success-message').hide();
      }
    }
  });
});
