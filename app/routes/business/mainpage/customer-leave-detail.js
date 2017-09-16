import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
    header_title:'老人请假',
    model(){
      return{};
    },
    setupController(controller, model){
      let _self = this;
      this._super(controller, model);
      var editMode=this.getCurrentController().get('editMode');
      var id=this.getCurrentController().get('id');
      if(editMode=='edit'){
        controller.set('detailEdit',false);
        this.store.findRecord('customer-leave',id).then(function(leave){
          controller.set('leave',leave);
          var allowEdit=leave.get("status")!==null&&leave.get("status")<=1;
          controller.set("allowEdit",allowEdit);
        });
      }else{
        controller.set('detailEdit',true);
        controller.set('leave',this.store.createRecord('customer-leave',{}));
      }
      let filterCustomer;
      filterCustomer = $.extend({}, filterCustomer, {
          '[customerStatus][typecode@$like]@$or1---1': 'customerStatusIn'
      });
      filterCustomer = $.extend({}, filterCustomer, {
          '[customerStatus][typecode@$like]@$or1---2': 'customerStatusTry'
      });
      filterCustomer = $.extend({}, filterCustomer, {
          'addRemark@$not': 'directCreate'
      });
     this.store.query("customer", {filterCustomer}).then(function(list) {
       let filter ;
       filter = $.extend({}, filter, {
           'status@$or1---1': 0
       });
       filter = $.extend({}, filter, {
           'status@$or1---2': 1
       });
       _self.store.query('customer-leave',{filter}).then(function(leaveList){
         let leaveCustomers = new Ember.A();
         leaveList.forEach(function(leaveInfo){
           leaveCustomers.pushObject(leaveInfo.get('customer'));
         });
         let customerList = new Ember.A();
         list.forEach(function(customer){
           if(!leaveCustomers.findBy('id',customer.get('id'))){
             customerList.pushObject(customer);
           }
         });
         controller.set("customerList", customerList);
       });

      });
    }
});
