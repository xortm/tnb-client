import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  dataLoader: Ember.inject.service("data-loader"),
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
    // this.get('store').query('statquerytype',{}).then(function(querytypeList){
    //   console.log('querytypeList is',querytypeList);
    //   controller.set('querytypeList',querytypeList);
    // });
    this.store.query('employee', {filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(employeeList) {
        employeeList.forEach(function(employee) {
            employee.set('sortName', pinyinUtil.getFirstLetter(employee.get("name")));
        });
        controller.set('employeeList', employeeList);
        controller.set('employeeArr', employeeList);
        var doQueryFlag=controller.get('doQueryFlag');
        doQueryFlag=++doQueryFlag;
        controller.set('doQueryFlag',doQueryFlag);
    });
    let serviceLevel = this.get("dataLoader").get("serviceLevel");
    console.log("serviceLevelList:",serviceLevel);
    controller.set('curEmployee', null);
    controller.set('serviceLevelList', serviceLevel);
    controller.set('serviceLevelListLength', serviceLevel.get("length") + 1);
  }
});
