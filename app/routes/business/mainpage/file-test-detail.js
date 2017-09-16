import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  queryParams: {
      physicalReportId: {
          refreshModel: true
      },
  },
  model(){
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
