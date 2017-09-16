import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  // header_title:'生活习惯',
  queryParams: {
    healtyCustomerId: {
        refreshModel: true
    },
  },
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '生活习惯(' + customerName +')';
  }),
  setupController: function(controller,model){
    this._super(controller,model);
  },
});
