define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    propertyToIdMap: {
      'password': 'user-details-password',
      'lastName': 'user-details-last-name',
      'firstName': 'user-details-first-name',
      'phoneNumber': 'user-details-phone-number',
      'username': 'user-details-username',
      'notes': 'user-details-notes',
      'age': 'user-details-age'
    },

    initialize: function() {
      var self = this;

      this.model.on("error invalid", function(model, error) {
        if (typeof error == 'object' && error.responseText) {
          error = (new Function('return ' + error.responseText) ()).msg;
        }
        self.$el.find('.error-message').html(error);
      });

      this.model.on("change", function() {
        self.$el.find('.error-message').html('');
      });

      // : null,
	    //   lastName: null,
	    //   password: null,
	    //   username: null,
	    //   phoneNumber: null,
	    //   age: 0,
	    //   genderIsFemale: false,
	    //   notes: null,

      Object.keys(this.propertyToIdMap).forEach(function(property) {
        var id = self.propertyToIdMap[property];
        self.model.on('change:' + property, function(model, value) {
          var elem = document.getElementById(id);
          if (elem) {
          elem.value = value;
          } else {
            console.log('Couldn\'t find', id);
}
        });
      });

      // this.model.on('change:password', function(model, value) {
      //   $('#user-details-password').val(value);
      // });

      // this.model.on('change:lastName', function(model, value) {
      //   $('#user-details-last-name').val(value);
      // });

      // this.model.on('change:firstName', function(model, value) {
      //   $('#user-details-first-name').val(value);
      // });

    },

    events: {
      'click .submit' : 'submitOnClick'
    },

    submitOnClick: function(e) {
      e.preventDefault();

      var map = $.extend({}, this.propertyToIdMap);
      Object.keys(map).forEach(function(property) {
        var id = map[property];
        map[property] = document.getElementById(id).value;
      });

      map.age = Number(map.age) || 0;
      // map.age = Number(map.age);
      this.model.putUserDetails(map);

      // FIXME: No-op?
      return false;
    }

  });
});