/* global require */
require.config({
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'underscore': {
      exports: '_'
    }
  },

  paths: {
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
    text: 'libs/text'
  }
});

require(['jquery'], function($) {
  window.$ = $;
  require(['bootstrap/js/bootstrap.js']);
});

require([
  'jquery',
  'models/AppModel',
  'views/WrapperView',
  'views/AvailableTitlesView',
  'pages/RegisterPage',
  'pages/SignInPage',
  'pages/EditUserDetailsPage',
  'backbone',
], function(
  $,
  AppModel,
  WrapperView,
  AvailableTitlesView,
  RegisterPage,
  SignInPage,
  EditUserDetailsPage,
  Backbone
) {
  // require(['test'], function() {});

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

  var registerPage = new RegisterPage({
    el: '#page-register',
    model: appModel.currentUser
  });

  var signInPage = new SignInPage({
    // FIXME: change id to page-sign-in
    el: '#page-signin',
    model: appModel.currentSession
  });

  var editUserDetailsPage = new EditUserDetailsPage({
    // FIXME: change id to page-sign-in
    el: '#page-user-details',
    model: appModel.currentUser
  });

  window.appModel.currentSession.signIn(
    { username: 'testuser1', password: 'password'}
  );


  // Router
  var AppRouter = Backbone.Router.extend({

    routes:{
      "":"list",
      "view-titles":"wineDetails"
    },

    list: function () {
      $('#page-view-titles').tab('show');
      // this.wineList = new WineCollection();
      // this.wineListView = new WineListView({model:this.wineList});
      // this.wineList.fetch();
      // $('#sidebar').html(this.wineListView.render().el);
    },

    viewTitles: function (id) {
      this.wine = this.wineList.get(id);
      if (appModel.wineView) appModel.wineView.close();
      this.wineView = new WineView({model:this.wine});
      $('#content').html(this.wineView.render().el);
    }

  });

});

// FIXME: Add "Success" messages;
// FIXME: Show username when signedIn?
// FIXME: Consistency: prefer events when possible
// FIXME: Add sorting
// FIXME: Add submit to "profile-edit"
// FIXME: Join sing-in and register pages
// FIXME: Namespace events
// FIXME: Style lists
// FIXME: Change page on sign in/out
// FIXME: Create page for the titles
// FIXME: Add routing

// FIXED: Sign-in on registration
// FIXED: Hide menu intially
// FIXED: Add sign-out
// FIXED: Make tabbar sections dynamic
