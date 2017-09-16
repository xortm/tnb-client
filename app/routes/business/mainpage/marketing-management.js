import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  model() {
      return {};
  },
  setupController(controller, model) {
  //controller.set('chooseDate','选择日期');
  controller.computedParams();
  this.get('store').query('statquerytype',{}).then(function(querytypeList){
    console.log('querytypeList is',querytypeList);
    controller.set('querytypeList',querytypeList);
  });
  }
});
