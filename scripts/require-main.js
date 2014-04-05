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

require(['app'], function() {
  // require(['test'], function() {});

  window.appModel.currentSession.signIn(
    { username: 'c', password: 'c'}
  );

});
