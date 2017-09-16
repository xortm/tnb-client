import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  // header_title:'健康数据',
  queryParams: {
    healtyCustomerId: {
        refreshModel: true
    },
    healthFlag: {
        refreshModel: true
    },
  },
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    console.log("customerName in health:",customerName);
    return '健康数据(' + customerName +')';
  }),

  setupController: function(controller,model){
    this._super(controller,model);
  },
});
