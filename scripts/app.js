define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  // ---------------------------------------------------------------------------

  var BaseModel = require('models/BaseModel');
  var BaseCollection = require('models/BaseCollection');
  var AppModel = require('models/AppModel');

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
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

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
