import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  model(){
    console.log("csinfo model");
    var model = Ember.Object.create({});
    return model;
  },
  setupController: function(controller,model){
    this._super(controller,model);

    // var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    // console.log("curCustomer jujia",curCustomer);
    // var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    // console.log("curCustomerId jujia",curCustomerId);
    //  var _self = this;
    // _self.store.findRecord("customer",curCustomerId).then(function(customer){
    //   console.log("customer success");
    //   model.set("curCustomer",customer);
    // });
  },

});
