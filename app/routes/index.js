import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    // this.get("store").query("userSession", {
    //   filter: {
    //     loginName: "13910165861",
    //     password: "96e79218965eb72c92a549dd5a330112",
    //   }
    // });
    this.transitionTo('business.mainpage');
  }
});
