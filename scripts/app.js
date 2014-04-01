/* global define */

define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  var Title = Backbone.Model.extend({
    defaults: function() {
      return {
	      description: null,
	      name: null,
	      id: null
      };

    }
  });

  var AvailableTitles = Backbone.Collection.extend({
    url: 'http://217.18.25.29:10070/gametitles/list',
    model: Title,
    parse: function(response, options) {
      return response.titles;
    }
    // sync: function(method, model) {
    //   // method can only be 'read'

    // }
  });

  var User = Backbone.Model.extend({
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
    }
  });

  var App = Backbone.Model.extend({
    defaults: function() {
      return {
        currentUser: null,
        currentSession: null,
        pages: null,
        currentPage: null
      };
    }
  });

  var Session = Backbone.Model.extend({
    defaults: function() {
      return {
        sessionId: null,
        userId: null,
        expiryTime: null
      };
    }
  });

  // VIEWS

  var TitleItem = Backbone.View.extend({
    tagName: 'li',
    template: null,
  });
  var TitlesPage = Backbone.View.extend({});
  var SignInPage = Backbone.View.extend({});
});
