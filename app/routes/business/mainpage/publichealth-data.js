import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  dateService: Ember.inject.service("date-service"),
  header_title: "健康数据",
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    controller.set("showLoadingImg",true);
    // var curUser = this.get("global_curStatus").getUser();//拿到当前人
    // var _self = this;
    // let sevenDate = _self.get("dateService").getDaysBeforeTimestamp(7);//7天前的0秒0分时间戳
    // this.store.query("staffcustomer",{filter:{
    //   staff:{id:curUser.get("id")},
    //   "examDateTime@$gte":sevenDate,
    // }}).then(function(staffcustomers){
    //   var staffcustomer = staffcustomers.get("firstObject");
    //   var customer = staffcustomer.get("customer");
    //   var customerId = staffcustomer.get("customer.id");
    //   _self.store.query('health-info',{filter:{examUser:{id:customerId}}}).then(function(healthInfoArray){
    //     controller.set("healthInfoArray",healthInfoArray);
    //     controller.set("queryFlag",true);
    //   });
    // });
  },
});
