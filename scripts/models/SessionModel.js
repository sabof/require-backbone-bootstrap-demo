define(function(require) {
  var BaseModel = require('models/BaseModel');
  var $ = require('jquery');

  return BaseModel.extend({
    signIn: function(attrs, options) {
      var self = this;

      if (! attrs.username) {
        this.trigger('invalid', this, 'Username is invalid');
        return;
      }

      if (! attrs.password) {
        this.trigger('invalid', this, 'Password is invalid');
        return;
      }

      options = $.extend({}, options || {}, {
        url: this.appModel.url() +
          'signin/' + attrs.username + '/' +
          attrs.password,

        success: function() {
          self.trigger('signedin');
        }
      });

      return this.fetch(options);
    },

    signOut: function() {
      // FIXME: Implement me
      // var self = this;

      this.clear().set(this.defaults);
    },

    isSignedIn: function() {
      return this.get('sessionId');
    },

    defaults: function() {
      return {
        sessionId: null,
        userId: null,
        expiryTime: null
      };
    }
  });
});
