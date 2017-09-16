import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  model(){
    console.log("activity-order model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    controller.set("curCustomer",curCustomer);
    this.store.query("activity",{}).then(function(activityList){
      controller.set("activityList",activityList);
    });
    this.store.query("employee",{}).then(function(employeeList){
      controller.set("employeeList",employeeList);
    });
  },

});
