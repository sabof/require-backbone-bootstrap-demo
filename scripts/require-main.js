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
  'backbone',
  'bootstrap'
], function(
  $,
  AppModel,
  WrapperView,
  AvailableTitlesView,
  RegisterPage,
  SignInPage,
  EditUserDetailsPage,
  Backbone,
  ignore
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

  // FIXME: Move to a separate file
  // FIXME: Combine with AppModel?

  // Router
  var AppRouter = Backbone.Router.extend({
    initialize: function() {
      this.route(/(.*)/, 'mainRoute');
    },

    mainRoute: function(name) {
      // console.log('route', name);
      var allowed = this.allowedPages();
      if (allowed.indexOf(name) === -1) {
        name = this.defaultPage();
      }
      $('a[href=#' + name + ']').tab('show');
    },

    currentPage: function() {
      return $('#pages .tab-pane.active').prop('id');
    },

    allowedPages: function() {
      if (this.appModel.currentSession.isSignedIn()) {
        return [
          'page-view-titles',
          'page-user-details'
        ];
      } else {
        return [
          'page-signin',
          'page-view-titles',
          'page-register',
        ];
      }
    },

    defaultPage: function() {
      return this.allowedPages()[0];
    },

  });

  var router = new AppRouter();
  router.appModel = appModel;

  Backbone.history.start();

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
