define(function(require) {
  var BasePage = require('pages/BasePage');
  var $ = require('jquery');
  var AvailableTitlesView = require('views/AvailableTitlesView');

  return BasePage.extend({
    initialize: function() {
      var availableTitles = new AvailableTitlesView(
        {model: this.model}
      );
      // this.views = [ availableTitles ];
      // this.$el.append('<h2>Available titles</h2>');
      this.$el.append(availableTitles.render().el);
    }
  });
});
