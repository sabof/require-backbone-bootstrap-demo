define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');

  return BasePage.extend({
    events: {
      'click .submit' : 'submitOnClick'
    },

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
      BasePage.prototype.initialize.call(this);

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

      this.model.on('change:genderIsFemale', function(model, value) {
        var radios = $('input[name=user-details-sex]');

        if (value) {
          radios.filter('[value=female]').prop('checked', 'checked');
        } else {
          radios.filter('[value=male]').prop('checked', 'checked');
        }
      });

    },

    submitOnClick: function(e) {
      e.preventDefault();

      var map = $.extend({}, this.propertyToIdMap);
      Object.keys(map).forEach(function(property) {
        var id = map[property];
        map[property] = document.getElementById(id).value;
      });

      map.genderIsFemale = $('input[name=user-details-sex]:checked').val() === 'female';
      map.age = Number(map.age) || 0;

      this.model.putUserDetails(map);
    }

  });
});
