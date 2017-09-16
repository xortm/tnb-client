import Ember from 'ember';

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  showDetail: true,
  actions: {
    enterDetail: function(csuser) {
      var cid = csuser.get("id");
      this.get("mainController").switchMainPage('cs-stuff-detail',{detail_type:2,user_id:cid});
      // this.transitionToRoute("/business/mainpage/cs-stuff-detail/mine/" + cid);
    },
  }
});
