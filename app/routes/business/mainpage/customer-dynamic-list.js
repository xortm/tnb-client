import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  // header_title:'老人动态',
  queryParams: {
      healtyCustomerId: {
          refreshModel: true
      },
  },
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '老人动态(' + customerName +')';
  }),

  setupController: function(controller,model){
    this._super(controller,model);
  },
});
