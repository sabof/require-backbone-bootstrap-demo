define(function(require) {
  var Backbone = require('backbone');
  var _ = require('underscore');

  return Backbone.View.extend({
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
