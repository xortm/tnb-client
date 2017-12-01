import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title: "服务记录",
  model(){
    return {};
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var _self = this;
    // this.store.query("staffcustomer",{filter:{staff:{id:curUser.get("id")}}}).then(function(staffcustomers){
    //   var staffcustomer = staffcustomers.get("firstObject");
    //   var customer = staffcustomer.get("customer");
    //   var customerId = staffcustomer.get("customer.id");
    //   console.log("customer11111",customer);
    //   console.log("customer11111",customerId);
    //   controller.set("customerId",customerId);
    // });
  },
});
