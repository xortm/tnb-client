import Ember from 'ember';

export default Ember.Controller.extend({

  actions:{
    refreshStaffList: function() {      
        var route = App.lookup('route:business.mainpage.service-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
  }
});
