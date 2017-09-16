import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'老人呼叫',
  queryParams: {
      customerListFlag: {
          refreshModel: true
      },
  },

  setupController: function(controller,model){
    this._super(controller,model);
  },
});
