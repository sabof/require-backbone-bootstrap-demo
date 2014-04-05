define(function(require) {
  var BaseModel = require('model/BaseModel');
  var Backbone = require('backbone');
  var $ = require('jquery');

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

    register: function(attrs) {
      return this.save(
        attrs, {
          url: this.appModel.url() + 'register/' + attrs.username,
          forceMethod: 'update'
        });
    },

    putUserDetails: function(attrs) {
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
          dataType: 'json',
          // FIXME: DO I still need this?
          data: JSON.stringify(this.attributes),

          contentType: 'application/json',
          headers: { sessionId: sessionId },

          success: function(data) {
            // console.log(data);
          }
        }
      );
    },

    getUserDetails: function(options) {
      // console.log('Retrieved user details');

      var sessionId = this.appModel.currentSession.get('sessionId');

      if (! (this.appModel.currentSession.isSignedIn()) ) {
        // FIXME: Trigger error event
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
      // FIXME: return a {property, message} object
      var errors = [];
      if ( ! attrs.username ) {
        errors.push({
          type: 'error',
          property: 'username',
          message: 'Username is invalid'
        });
      }
      if ( ! attrs.firstName ) {
        errors.push({
          type: 'error',
          message: 'First name is invalid'
        });
      }
      if ( ! attrs.lastName ) {
        errors.push({
          type: 'error',
          property: 'lastName',
          message: 'Last name is invalid'
        });
      }
      if ( ! attrs.password ) {
        errors.push({
          type: 'error',
          property: 'password',
          message:  'Password is invalid'
        });
      }
      if ( ! attrs.phoneNumber ) {
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

      initialize: function() {
        var self = this;

        this.appModel.currentSession.on(
          'change:userId', function() {
            self.getUserDetails();
          }
        );
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
