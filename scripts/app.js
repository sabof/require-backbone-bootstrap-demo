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
        console.log('C appModel');
        this.appModel = opts.appModel;
        delete attrs.appModel;
      }

      Backbone.Collection.apply(this, arguments);
    }
  });

  // ---------------------------------------------------------------------------

  var TitleModel = BaseModel.extend({
    url: function() {
      // return this.appModel.currentUser.url();
    },

    defaults: function() {
      return {
	      description: null,
	      name: null,
	      id: null
      };
    },

    sync: function(method, model, options) {
      if (method == 'delete') {
        // return $.ajax('');
      } else {
        return Backbone.sync(method, model, options);
      }
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

    initialize: function() {
      // this.model = this.model.bind(this);
    },

    parse: function(response, options) {
      return response.titles;
    }
  });

  // ---------------------------------------------------------------------------

  var UserModel = BaseModel.extend({
    url: function() {
      // 'register' or 'sign-in'
      // if (this.appModel.sessionId
      return this.appModel.url() + this.get('username');
    },

    register: function(attrs) {
      return this.save(
        attrs, {
          url: this.appModel.url() + 'register/' + attrs.username,
          forceMethod: 'update'
        });
    },

    validate: function(attrs) {
      console.log('validate', attrs);
      if ( ! attrs.username ) {
        return 'Username is invalid';
      }
      if ( ! attrs.firstName ) {
        return 'First name is invalid';
      }
      if ( ! attrs.lastName ) {
        return 'Last name is invalid';
      }
      if ( ! attrs.password ) {
        return 'Password is invalid';
      }
      if ( ! attrs.phoneNumber ) {
        return 'Phone number is invalid';
      }
    },

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
      this.currentUser = new UserModel(false, {
        appModel: this
      });

      this.currentSession = new SessionModel(false, {
        appModel: this
      });
    }
  });

  // ---------------------------------------------------------------------------

  var SessionModel = BaseModel.extend({
    signIn: function(options) {
      this.fetch({
        url: this.appModel.url() +
          'signin/' + options.username +
          '/' + options.password
      });
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

  var TitleView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template(ItemTemplate),

    deleteTitle: function(event) {
      this.model.destroy();
    },

    initialize: function() {
      var self = this;

      this.model.on('remove', function() {
        self.remove();
      });

    },

    events: {
      "click .delete": "deleteTitle"
    },

    render: function() {
      this.$el.html(
        this.template(
          this.model.toJSON()
      ));
      return this;
    }
  });

  // ---------------------------------------------------------------------------

  var UserTitlesCollection = BaseCollection.extend({
    url: function() {
      var root = this.appModel.currentUser.url();
      return root + '/titles';
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

      // this.model.on("all", function(eventName){
      //   console.log(eventName + ' was triggered!');
      // });
    },

    render:function (eventName) {
      // console.log('length', this.model.models.length);
      _.each(this.model.models, function (title) {
        // console.log('adding', title);

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
      this.model.on("error invalid", function(model, error) {
        console.log('invalidEvent', model);
        if (typeof error == 'object' && error.responseText) {
          error = eval('(' + error.responseText + ')').msg;
        }
        self.$el.find('.error-message').html(error);
      });

      this.model.on("change", function() {
        // FIXME: Set cookie
        self.$el.find('.error-message').html('');
      });

    },

    events: {
      'click .submit' : 'submitOnClick'
    }
  });

  // $('#main-content').html(item.render().el);

  // Model per page?
  // Is there something special about the 'model' property?

  // ---------------------------------------------------------------------------

  var RegisterPage = Backbone.View.extend({
    // setErrorMessage: function(message) {

    // },

    initialize: function() {
      var self = this;

      // this.model.on('all', function(a, b, c) {
      //   console.log('model all', a, b, c);
      // });

      this.model.on("error invalid", function(model, error) {
        console.log('invalidEvent', model);
        if (typeof error == 'object' && error.responseText) {
          error = eval('(' + error.responseText + ')').msg;
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

  var appModel = new AppModel();

  var availableModel = window.availableModel = new AvailableTitlesCollection(false, {
    appModel: appModel
  });

  var list = window.list = new AvailableTitlesView({
    model: availableModel
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
