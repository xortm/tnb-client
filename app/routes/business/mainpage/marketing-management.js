import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  model() {
      return {};
  },
  setupController(controller, model) {
  //controller.set('chooseDate','选择日期');
  controller.set('beginDate',null);
  controller.set('endDate',null);
  controller.set('durTypeFlag',null);
  controller.set('beginseaconDate',null);
  controller.set('endseaconDate',null);
  controller.computedParams();
  this.get('store').query('statquerytype',{}).then(function(querytypeList){
    console.log('querytypeList is',querytypeList);
    controller.set('querytypeList',querytypeList);
  });
  }
});
