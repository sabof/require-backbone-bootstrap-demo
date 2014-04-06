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

  var appModel = window.appModel = new AppModel();

  var wrapperModel = new WrapperView({
    el: '#main-navigation',
    model: appModel
  });

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

  var router = new Router({
    appModel: appModel
  });

  Backbone.history.start();

  window.appModel.currentSession.signIn(
    { username: 'testuser1', password: 'password'}
  );

});

// FIXME: Add "Success" messages;
// FIXME: Style lists
// FIXME: Fix input types

// Nice to have

// FIXME: Change messages to <ul>
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
