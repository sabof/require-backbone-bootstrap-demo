define(function(require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  var _ = require('underscore');

  // ---------------------------------------------------------------------------

  var BaseModel = require('models/BaseModel');
  var BaseCollection = require('models/BaseCollection');
  var AppModel = require('models/AppModel');

  var BaseView = require('views/BaseView');
  var BasePage = require('pages/BasePage');
  var TitleView = require('views/TitleView');
  var AvailableTitlesView = require('views/AvailableTitlesView');

  // VIEWS
  // Model per page?
  // Is there something special about the 'model' property?

  // ---------------------------------------------------------------------------

});

// // Router
// var AppRouter = Backbone.Router.extend({

//     routes:{
//         "":"list",
//         "wines/:id":"wineDetails"
//     },

//     initialize:function () {
//         $('#header').html(new HeaderView().render().el);
//     },

//     list:function () {
//         this.wineList = new WineCollection();
//         this.wineListView = new WineListView({model:this.wineList});
//         this.wineList.fetch();
//         $('#sidebar').html(this.wineListView.render().el);
//     },

//     wineDetails:function (id) {
//         this.wine = this.wineList.get(id);
//         if (appModel.wineView) appModel.wineView.close();
//         this.wineView = new WineView({model:this.wine});
//         $('#content').html(this.wineView.render().el);
//     }

// });

// FIXME: Add "Success" messages;
// FIXME: Make tabbar sections dynamic
// FIXME: Show username when signedIn?
// FIXME: Consistency: prefer events when possible
// FIXME: Add sorting
// FIXME: Add sign-out
// FIXME: Add submit to "profile-edit"
