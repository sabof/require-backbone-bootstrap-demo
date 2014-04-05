/*global define*/

define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  var ItemTemplate = require('text!../templates/title-item.html');

  var BaseModel = Backbone.Model.extend({
    constructor: function(attrs, opts) {
      if (opts && opts.appModel) {
        this.appModel = opts.appModel;
        delete attrs.appModel;
      }

      Backbone.Model.apply(this, arguments);
    }
  });

  // ---------------------------------------------------------------------------

  var BaseCollection = Backbone.Collection.extend({
    constructor: function(attrs, opts) {
      if (opts && opts.appModel) {
        this.appModel = opts.appModel;
        delete opts.appModel;
      }

      Backbone.Collection.apply(this, arguments);
    }
  });

  // ---------------------------------------------------------------------------

  var BaseView = Backbone.Collection.extend({
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

  // ---------------------------------------------------------------------------

  var TitleModel = BaseModel.extend({
    initialize: function() {
      // this.on('all', function(event, model, message) {
      //   console.log('titleModel', event, model, message);
      // });
    },

    url: function() {
      // FIXME: Do I need the full URL?
      // FIXME: How do full urls relate to urlRoot?
      return this.appModel.currentUser.url() +
        '/titles/' + this.get('id');
    },

    defaults: function() {
      return {
	      description: null,
	      name: null,
	      id: null
      };
    },

    isFavourite: function() {
      var self = this;
      var id = self.get('id');
      return !! this.appModel.favouriteTitles.find(function(it) {
        return id === it.get('id');
      });
    },

    isEqual: function(model) {
      return this.get('id') == model.get('id');
    },

    addToFavourites: function() {
      var self = this;
      var sessionId = this.appModel.currentSession.get('sessionId');
      return BaseModel.prototype.sync(
        'update', this, {
          contentType: 'application/json',
          headers: { sessionId: sessionId },
          success: function() {
            // FIXME: Verify data contains a success message
            // FIXME: Verify an item with this Id doesn't already exist

            if (! self.isFavourite()) {
              self.appModel.favouriteTitles.add(self);
              self.trigger('favouriteadded');
              // console.log('Added favourite');
            }
          }
        });
    },

    removeFromFavourites: function() {
      var self = this;
      var sessionId = this.appModel.currentSession.get('sessionId');

      // FIXME: Deletes the model?
      return BaseModel.prototype.sync(
        'delete', this, {
          contentType: 'application/json',
          headers: { sessionId: sessionId },

          success: function() {
            // FIXME: Verify data contains a success message
            var theTitle = self
                  .appModel
                  .favouriteTitles
                  .find(function(it) { return it.id === self.id; });

            if (theTitle) {
              self.appModel.favouriteTitles.remove(theTitle);
              self.trigger('favouriteremoved');
              // console.log('Removed favourite');
            }
          }
        });
    }
  });

  // ---------------------------------------------------------------------------

  var AvailableTitlesCollection = BaseCollection.extend({
    url: function() {
      return this.appModel.url() + 'gametitles/list';
    },

    model: function(attrs, options) {
      var title = new TitleModel(attrs, options);
      title.appModel = options.collection.appModel;

      return title;
    },

    getTitles: function() {
      // console.log('Retrieved titles');
      return this.fetch();
    },

    initialize: function() {
      var self = this;

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function() {
          // console.log();
          self.getTitles();
        }
      );

    },

    parse: function(response, options) {
      return response.titles;
    }
  });

  // ---------------------------------------------------------------------------

  var UserModel = BaseModel.extend({
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
        {}, options || {}, {
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

  // ---------------------------------------------------------------------------

  var AppModel = BaseModel.extend({
    url: function() {
      return 'http://217.18.25.29:10070/';
    },

    initialize: function() {
      // FIXME: DI?
      this.currentSession = new SessionModel(false, {
        appModel: this
      });

      this.currentUser = new UserModel(false, {
        appModel: this
      });

      this.favouriteTitles = new UserFavouriteTitlesCollection(false, {
        appModel: this
      });

      this.availableTitles = new AvailableTitlesCollection(false, {
        appModel: this
      });

    },

  });

  // ---------------------------------------------------------------------------

  var SessionModel = BaseModel.extend({
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

  // VIEWS
  // ---------------------------------------------------------------------------

  var TitleView = Backbone.View.extend({
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

      // this.model.on('remove', function() {
      //   self.remove();
      // });

      this.$el.html(
        this.template(
          this.model.toJSON()
      ));

      // FIXME: Move to TitleView?
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

  // ---------------------------------------------------------------------------

  // FIXME: Merge with AvailableTitlesCollection?
  var UserFavouriteTitlesCollection = BaseCollection.extend({
    initialize: function() {
      var self = this;

      this.on('all', function(event, model, message) {
        console.log('userFavouriteTitlesCollection', event, model, message);
      });

      // FIXME: Do I need this?
      this.appModel.currentSession.on(
        'change:userId', function(model, value) {
          console.log('favs', value);
          if (value) {
            self.getTitles();
          } else {
            self.reset([]);
          }
        }
      );
    },

    getTitles: function() {
      var self = this;

      // console.log('Retrieved titles');
      var sessionId = this.appModel.currentSession.get('sessionId');
      return this.fetch({
        headers: { sessionId: sessionId },
        success: function() {

          // FIXME: Move to Titles
          var favouriteIds = self.models.map(function(it) {
            return it.get('id');
          });

          // self.models.
        }
      });
    },

    url: function() {
      var root = this.appModel.currentUser.url();
      return root + '/titles';
    },

    parse: function(response, options) {
      return response.titles;
    },

    model: function(attrs, options) {
      var title = new TitleModel(attrs, options);
      title.appModel = options.collection.appModel;
      return title;
    }

  });

  // ---------------------------------------------------------------------------

  var UserTitlesView = Backbone.View.extend({

  });

  // ---------------------------------------------------------------------------

  var AvailableTitlesView = Backbone.View.extend({
    tagName: 'table',

    initialize: function () {
      this.$el.addClass('table');

      // this.model.bind("reset", this.render, this);
      // var self = this;
      // this.model.bind("add", function (wine) {
      //   $(self.el).append(new WineListItemView({model:wine}).render().el);
      // });

      // this.model.bind("reset", this.render, this);
      // this.model.bind("change", this.render, this);

      // FIXME: Change to add?
      this.model.bind("sync", this.render, this);

    },

    render: function (eventName) {
      _.each(this.model.models, function (title) {

        this.$el.append(
          new TitleView({model: title})
            .render()
            .el
        );
      }, this);

      return this;
    },

  });

  // ---------------------------------------------------------------------------

  var SignInPage = Backbone.View.extend({
    submitOnClick: function(e) {
      e.preventDefault();

      this.model.signIn({
        username: $('#signin-username').val(),
        password: $('#signin-password').val()
      });

      // var user = this.appModel.currentUser;
      // this.model.fetch(false, {url: );
    },

    initialize: function() {
      var self = this;

      // FIXME: Move to base class?
      // this.model.on("error invalid", function(model, error) {
      //   console.log('signIn EI', model, error);
      // });

      this.model.on("change", function() {
        // FIXME: Set cookie?
        self.$el.find('.error-message').html('');
      });

    },

    events: {
      'click .submit' : 'submitOnClick'
    }
  });

  // Model per page?
  // Is there something special about the 'model' property?

  // ---------------------------------------------------------------------------

  var RegisterPage = Backbone.View.extend({
    initialize: function() {
      var self = this;

      // this.model.on('all', function(a, b, c) {
      //   console.log('model all', a, b, c);
      // });

      this.model.on("error invalid", function(model, error) {
        // console.log('invalidEvent', model);
        if (typeof error == 'object' && error.responseText) {
          error = (new Function('return ' + error.responseText) ()).msg;
        }
        self.$el.find('.error-message').html(error);
      });

      this.model.on("change", function() {
        self.$el.find('.error-message').html('');
      });
    },

    events: {
      'click .submit' : 'submitOnClick'
    },

    submitOnClick: function(e) {
      e.preventDefault();

      this.model.register({
        username: $('#register-username').val(),
        firstName: $('#register-first-name').val(),
        lastName: $('#register-last-name').val(),
        password: $('#register-password').val(),
        phoneNumber: $('#register-phone-number').val()
      });

      // FIXME: No-op?
      return false;
    }

  });

  // ---------------------------------------------------------------------------

  var WrapperView = Backbone.View.extend({
    initialize: function() {
      var self = this;

      this.model.currentSession.on('signedin signedout', function() {
        self.render();
      });
      this.render();
    },

    events: {
      'click #button-signout' : 'signOutOnClick'
    },

    signOutOnClick: function(e) {
      e.preventDefault();
      this.model.currentSession.signOut();
    },

    render: function() {
      this.$el.find('li').show();

      if (this.model.currentSession.isSignedIn()) {
        this.$el
          .find('a[href=#page-signin], a[href=#page-register]')
          .parent()
          .hide();
      } else {
        this.$el
          .find('a[href=#page-user-details], a[href=#page-signout]')
          .parent()
          .hide();
      }
    }

  });

  // ---------------------------------------------------------------------------

  var appModel = window.appModel = new AppModel();

  var wrapperModel = new WrapperView({
    el: '#main-navigation',
    model: appModel
  });

  // var availableTitlesCollection =
  //     window.availableTitlesCollection =
  //     new AvailableTitlesCollection(false, {
  //   appModel: appModel
  // });

  var list = window.list = new AvailableTitlesView({
    model: appModel.availableTitles
  });

  $('#page-view-titles').html(list.render().el);
  list.model.fetch();

  var registerPage = new RegisterPage({
    el: '#page-register',
    model: appModel.currentUser
  });

  var signInPage = new SignInPage({
    // FIXME: change id to page-sign-in
    el: '#page-signin',
    model: appModel.currentSession
  });

});

// // Router
// var AppRouter = Backbone.Router.extend({

//     routes:{
//         "":"list",
//         "wines/:id":"wineDetails"
//     },

//     initialize:function () {
//         $('#header').html(new HeaderView().render().el);
//     },

//     list:function () {
//         this.wineList = new WineCollection();
//         this.wineListView = new WineListView({model:this.wineList});
//         this.wineList.fetch();
//         $('#sidebar').html(this.wineListView.render().el);
//     },

//     wineDetails:function (id) {
//         this.wine = this.wineList.get(id);
//         if (appModel.wineView) appModel.wineView.close();
//         this.wineView = new WineView({model:this.wine});
//         $('#content').html(this.wineView.render().el);
//     }

// });

// FIXME: Add "Success" messages;
// FIXME: Make tabbar sections dynamic
// FIXME: Show username when signedIn?
// FIXME: Consistency: prefer events when possible
// FIXME: Add sorting
// FIXME: Add sign-out
// FIXME: Add submit to "profile-edit"
