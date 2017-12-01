import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
      mobile: {
          refreshModel: true
      },
  },
  setupController: function(controller,model){
    this._super(controller, model);
  },
});
