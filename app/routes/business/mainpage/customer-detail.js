import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  header_title:'老人详情',
  queryParams: {
      id: {
          refreshModel: true
      },
      scanFlag: {
          refreshModel: true
      },
  },
  model(){
  },
  // doQuery:function(){
  //   var controller = this.get("controller");
  //   var params = this.buildQueryParams();
  //   this.store.query("customer",params).then(function(customers){
  //     var customer = customers.get("firstObject");
  //     console.log("customer1111",customer);
  //     controller.set("customer",customer);
  //     controller.incrementProperty("switchShowFlag");
  //   });
  // },
  // buildQueryParams:function(){
  //   var params = {};
  //   var controller = this.get("controller");
  //   var id = controller.get("id");
  //   var filter = {id:id};
  //   params.filter = filter;
  //   console.log("params filter",params);
  //   return params;
  // },
  setupController: function(controller,model){
    this._super(controller,model);
    var id = controller.get("id");
    var customer = this.store.peekRecord('customer',id);
    controller.set("customer",customer);
    controller.incrementProperty("healthShowFlag");
    // this.doQuery();
  },

});
