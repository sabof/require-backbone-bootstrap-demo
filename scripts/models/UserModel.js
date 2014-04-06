define(function(require) {
  var BaseModel = require('model/BaseModel');
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  return BaseModel.extend({
    defaults: function() {
      return {
	      firstName: null,
	      lastName: null,
	      password: null,
	      username: null,
	      phoneNumber: null,
	      userId: null,
	      age: 0,
	      genderIsFemale: false,
	      notes: null,
	    };
    },

    url: function() {
      var userId = this.appModel.currentSession.get('userId');
      return this.appModel.url() + 'profile/' + userId;
    },

    initialize: function() {
      var self = this;

      this.on('change', this.trigger.bind(this, 'message', this, []));
      this.on('invalid', function(model, messages) {
        self.trigger('message', self, messages);
      });

      this.appModel.currentSession.on(
        'signin', function() {
          self.getUserDetails();
        }
      );

      this.appModel.currentSession.on(
        'signout', function() {
          console.log('clearingUser');
          self.clear().set(self.defaults);
        }
      );

    },

    register: function(attrs) {
      var self = this;
      return this.save(
        attrs, {
          url: this.appModel.url() + 'register/' + attrs.username,
          forceMethod: 'update',
          success: function() {
            var messages = [{
              type: 'success',
              message: "The registration was successful"
            }];
            self.trigger('message', self, messages);

            self.appModel.currentSession.signIn(attrs);
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
    },

    putUserDetails: function(attrs) {
      var self = this;

      if (arguments.length !== 1) {
        throw new Error(
          'Wrong number of arguments. Expected 1, but got ' +
            arguments.length
        );
      }

      if (! this.appModel.currentSession.isSignedIn()) {
        // FIXME: Trigger error event
        return;
      }

      if (! this.set(attrs, {validate: true})) {
        return;
      }

      var sessionId = this.appModel.currentSession.get('sessionId');

      return BaseModel.prototype.sync(
        'update', this, {
          data: JSON.stringify(this.attributes),
          contentType: 'application/json',
          headers: {
            sessionId: sessionId,
          },

          success: function() {
            var messages = [{
              type: 'success',
              message: "The details where sucessfully updated"
            }];
            self.trigger('message', self, messages);
          },

          error: function(error) {
            var messages = [{
              type: 'error',
              message: self.extactServerError(error)
            }];
            self.trigger('message', self, messages);
          }
        }
      );
    },

    getUserDetails: function(options) {
      var sessionId = this.appModel.currentSession.get('sessionId');

      if (! (this.appModel.currentSession.isSignedIn()) ) {
        return;
      }

      options = $.extend(
        {}, options, {
          contentType: 'application/json',
          headers: { sessionId: sessionId },
        });

      return this.fetch(options);

    },

    validate: function(attrs) {
      var errors = [];

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

      if ( attrs.phoneNumber &&
           ! /^[ 1-9-]+$/.test(attrs.phoneNumber)) {
        errors.push({
          type: 'error',
          property: 'phoneNumber',
          message: 'Phone number is invalid'
        });
      }

      if (errors.length) {
        return errors;
      }
    },

    // FIXME: Move to base class?
    sync: function(method, model, options) {
      if (options.forceMethod) {
        method = options.forceMethod;
      }
      return Backbone.sync(method, model, options);
    }

  });
});
