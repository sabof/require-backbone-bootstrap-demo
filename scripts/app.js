/*global define*/

define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  var ItemTemplate = require('text!../templates/title-item.html');

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

  var TitleView = Backbone.View.extend({
    tagName: 'li',

    template: _.template(ItemTemplate),

    render: function() {
      this.$el.html(
        this.template(
          this.model.toJSON()
      ));
      return this;
    }
  });

  var TitlesView = Backbone.View.extend({
    tagName: 'ul',
    initialize:function () {
      // this.model.bind("reset", this.render, this);
      // this.model.bind("change", this.render, this);
      this.model.bind("sync", this.render, this);

      this.model.on("all", function(eventName){
        console.log(eventName + ' was triggered!');
      });
    },

    render:function (eventName) {
      console.log('length', this.model.models.length);
      _.each(this.model.models, function (title) {
        console.log('adding', title);

        $(this.el).append(
          new TitleView({model: title})
            .render()
            .el
        );
      }, this);

      return this;
    }
  });

  var SignInPage = Backbone.View.extend({});

  // var item = new TitleView({

  // });

  // $('#main-content').html(item.render().el);
  var list = window.list = new TitlesView({
    model: new AvailableTitles()
  });
  $('#main-content').html(list.render().el);
  list.model.fetch();

});
