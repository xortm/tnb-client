import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    loginType: {
      refreshModel: true
    }
  },
  setupController: function(controller,model){
    var _self = this;
    controller.getJujia();
    controller.set('deterDisabled',false);
    controller.set('responseInfo','');
    controller.set('deterSDisabled',false);
    this._super(controller, model);
    console.log("controller in",controller);
  },
});
