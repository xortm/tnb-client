import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  model(){
    console.log("csinfo model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    console.log("curCustomer in photo",curCustomer);
    controller.set("curCustomer",curCustomer);
  },

});
