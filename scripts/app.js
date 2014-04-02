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
      if ( ! (attrs.username &&
              attrs.firstName &&
              attrs.lastName &&
              attrs.password &&
              attrs.phoneNumber)
         ) {
        return 'something is invalid';
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
      // console.log('deleted', this);
      this.model.destroy();
    },

    initialize: function() {
      var self = this;

      this.model.on('remove', function() {
        self.remove();
      });

    },

    events:{
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
    userModel: null,

    submitOnClick: function() {
      this.userModel.save();
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
    initialize: function() {

    },

    events: {
      'click .submit' : 'submitOnClick'
    },

    submitOnClick: function(e) {
      e.preventDefault();

      // FIXME: Wrap in a model method

      this.model.register({
        firstName: $('#register-first-name').val(),
        lastName: $('#register-last-name').val(),
        password: $('#register-password').val(),
        phoneNumber: $('#register-phone-number').val()
      });

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

  $('#pages #view-titles').html(list.render().el);
  list.model.fetch();


  var registerPage = new RegisterPage({
    el: '#pages #register',
    model: appModel.currentUser
  });

  var signInPage = new SignInPage({
    // FIXME: change id to page-sign-in
    el: '#pages #sign-in',
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
