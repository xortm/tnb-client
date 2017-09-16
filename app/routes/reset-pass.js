import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    loginType: {
      refreshModel: true
    }
  },
  setupController: function(controller,model){
    controller.set('deterDisabled',false);
    controller.set('responseInfo','');
    controller.set('deterSDisabled',false);
    controller.set('responseMMess','');
    controller.set('responseMess','');
    this._super(controller, model);

    console.log("controller in",controller);
  },
});
