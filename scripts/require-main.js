/* global require */

require.config({
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'underscore': {
      exports: '_'
    },

    'bootstrap': {
      deps: ['jquery-make-global'],
    }
  },

  paths: {
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    bootstrap: '../bootstrap/js/bootstrap',
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
    text: 'libs/text'
  }
});

define('jquery-make-global',['jquery'],function($){
  window.jQuery = window.$ = $;
});

require([
  'jquery',
  'models/AppModel',
  'views/WrapperView',
  'views/AvailableTitlesView',
  'pages/RegisterPage',
  'pages/SignInPage',
  'pages/EditUserDetailsPage',
  'pages/AvailableTitlesPage',
  'backbone',
  'bootstrap',
  'router'
], function(
  $,
  AppModel,
  WrapperView,
  AvailableTitlesView,
  RegisterPage,
  SignInPage,
  EditUserDetailsPage,
  AvailableTitlesPage,
  Backbone,
  _Bootstrap,
  Router
) {
  /* jshint nonew: false */

  var appModel = window.appModel = new AppModel();

  appModel.registerPage(
    'page-view-titles',
    new AvailableTitlesPage({
      el: '#page-view-titles',
      model: appModel.availableTitles
    })
  );

  appModel.registerPage(
    'page-register',
    new RegisterPage({
      el: '#page-register',
      model: appModel.currentUser
    })
  );

  appModel.registerPage(
    'page-signin',
    new SignInPage({
      el: '#page-signin',
      model: appModel.currentSession
    })
  );

  appModel.registerPage(
    'page-user-details',
    new EditUserDetailsPage({
      el: '#page-user-details',
      model: appModel.currentUser
    })
  );

  new WrapperView({
    el: '.container',
    model: appModel
  });

  new Router({
    appModel: appModel
  });

  Backbone.history.start();

  window.appModel.currentSession.signIn(
    { username: 'testuser1', password: 'password'}
  );

});

// Nice to have

// FIXME: Better validation rules
// FIXME: Support chrome's auto-fill
// FIXME: Show username when signedIn?
// FIXME: Namespace events
// FIXME: Add favourite immediately
// FIXME: Set cookie upon logging-in?
// FIXME: Set .error style on incorrect inputs

// General

// FIXME: How much do TitleModels need to know about the collections?
// FIXME: Consistency: prefer events when possible

// Won't fix

// FIXME: Join sing-in and register pages
// FIXME: Add sorting

// Fixed

// FIXED: Change messages to <ul>
// FIXED: Style lists
// FIXED: Fix input types
// FIXED: Add "Success" messages;
// FIXED: Change "singedin" to "signin"
// FIXED: Generalize server messages to html
// FIXED: Create page for the titles
// FIXED: Add submit to "profile-edit"
// FIXED: Change page on sign in/out
// FIXED: Add routing
// FIXED: Sign-in on registration
// FIXED: Hide menu intially
// FIXED: Add sign-out
// FIXED: Make tabbar sections dynamic
