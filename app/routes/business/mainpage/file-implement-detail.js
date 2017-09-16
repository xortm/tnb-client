import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  queryParams: {
      executionReportId: {
          refreshModel: true
      },
  },
  model(){
  },
  setupController: function(controller,model){
    this._super(controller,model);
  },

});
