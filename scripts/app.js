/*global define*/

define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  var ItemTemplate = require('text!../templates/title-item.html');

  var TitleModel = Backbone.Model.extend({
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

  var AvailableTitlesModel = Backbone.Collection.extend({
    url: 'http://217.18.25.29:10070/gametitles/list',

    // model: TitleModel,
    model: function(attrs, options) {
      // No-op
      attrs.appModel = this.appModel;
      // debugger;
      return new TitleModel(attrs, options);
    },

    parse: function(response, options) {
      return response.titles;
    }
  });

  var UserModel = Backbone.Model.extend({
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
      return Backbone.sync(method, model, options);
    }
  });

  var AppModel = Backbone.Model.extend({
    defaults: function() {
      return {
        currentUser: null,
        currentSession: null,
        pages: null,
        currentPage: null
      };
    }
  });

  var SessionModel = Backbone.Model.extend({
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

      // this.model.on("all", function(eventName){
      //   console.log(eventName + ' was triggered!');
      // });
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

  var UserTitlesCollection = Backbone.Collection.extend({
    url: function() {
      var root = this.appModel.currentUser.url();
      return root + '/titles';
    }
  });

  var UserTitlesView = Backbone.View.extend({

  });

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

  var appModel = new AppModel();

  var list = window.list = new AvailableTitlesView({
    model: new AvailableTitlesModel({
      appModel: appModel
    })
  });

  $('#pages #view-titles').html(list.render().el);
  list.model.fetch();

  // Model per page?
  // Is there something special about the 'model' property?

  // var signInPage = new SignInPage({
  //   $el: $('#pages .sign-in'),
  //   userModel: new UserModel()
  // });

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
