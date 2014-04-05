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
  },
});

require(
  ['models/AppModel',
   'views/WrapperView',
   'views/AvailableTitlesView',
   'jquery',
   'pages/RegisterPage',
   'pages/SignInPage'],
  function(
    AppModel,
    WrapperView,
    AvailableTitlesView,
    $,
    RegisterPage,
    SignInPage
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

    window.appModel.currentSession.signIn(
      { username: 'c', password: 'c'}
    );

  });
