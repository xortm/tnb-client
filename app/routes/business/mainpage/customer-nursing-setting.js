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
  detailEdit:true,
  header_title:'客户护理安排信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var id=this.getCurrentController().get('id');
    this.store.findRecord('user',id).then(function(curStaff){
      controller.set('curStaff',curStaff);
    });
    controller.set('detailEdit',false);
    this.store.findRecord('staffcustomer',id).then(function(staffCustomerInfo){
      var mainController=App.lookup('route:business.mainpage.nursing-worker-group-management');
      controller.set('staffCustomerInfo',staffCustomerInfo);
      // console.log('staffCustomerInfo_is',staffCustomerInfo.get('id'));
    });

    var allArr= new Ember.A();
    this.store.findAll('customer').then(function(customerList){
      customerList.forEach(
        function(customer){
          allArr.pushObject(customer);
        }
      );
    });
    // console.log('allArr',allArr);
    var staffArr = new Ember.A();
    this.store.query('staffcustomer',{filter:{staff:{id:controller.get('id')}}}).then(function(staffcustomerList){
      staffcustomerList.forEach(
        function(staffcustomer){
          staffArr.pushObject(staffcustomer.get("customer"));
          console.log('staffcustomer:',staffcustomer.get('id'));
        }
      );
      allArr.forEach(function(customer){
        var c = staffArr.findBy("id",customer.get("id"));
        console.log('c is is',customer.get("id"));
        customer.set('hasSelected',false);
        if(c&&c.get("id")){
          console.log('c_self',c.get('id'));
          customer.set("hasSelected",true);
        }
      });
    });
      controller.set('staffCustomerList',allArr);
  }

});
