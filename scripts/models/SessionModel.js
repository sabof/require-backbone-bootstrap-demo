define(function(require) {
  var BaseModel = require('models/BaseModel');
  var $ = require('jquery');

  return BaseModel.extend({
    defaults: function() {
      return {
        sessionId: null,
        userId: null,
        expiryTime: null
      };
    },

    signIn: function(attrs, options) {
      var self = this;
      var errors = [];

      this.on('change', this.trigger.bind(this, 'message', this, []));

      if ( ! attrs.username ) {
        errors.push({
          type: 'error',
          property: 'username',
          message: 'The username is mandatory'
        });
      }

      if ( ! attrs.password ) {
        errors.push({
          type: 'error',
          property: 'password',
          message:  'The password is mandatory'
        });
      }

      if (errors.length) {
        this.trigger('invalid message', this, errors);
        return errors;
      }

      options = $.extend({}, options, {
        url: this.appModel.url() +
          'signin/' + attrs.username + '/' +
          attrs.password,

        success: function() {
          var messages = [{
            type: 'success',
            message: 'Logged in'
          }];

          self.trigger('signin message', self, messages);
        },

        error: function(model, error) {
          // debugger;
          var messages = [{
            type: 'error',
            message: self.extactServerError(error)
          }];

          self.trigger('message', self, messages);
        }

      });

      return this.fetch(options);
    },

    signOut: function() {
      this.clear().set(this.defaults);
      this.trigger('signout');
    },

    isSignedIn: function() {
      return this.get('sessionId');
    }

  });
});
