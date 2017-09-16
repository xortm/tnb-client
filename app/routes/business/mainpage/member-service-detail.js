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
  header_title:'执行情况信息',
  model(){
    return{};
  },
  setupController(controller, model){
    var _self=this;
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    controller.set('id',id);
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('nursingplanexe',id).then(function(planInfo){
        controller.set('planInfo',planInfo);
        //查询老人对应的护理项目
        _self.store.query('nursingprojectitem',{filter:{'[project][customer][id]':planInfo.get('recorder.id')}}).then(function(list){
          //获取护理方案所对应的护理项目
          console.log('list is',list);
          controller.set('serviceList',list);
        });
      });

    }else{
      controller.set('serviceList',null);
      controller.set('detailEdit',true);
      controller.set('planInfo',this.store.createRecord('nursingplanexe',{}));
    }
    //获取护工老人对照表
    this.store.query('employee',{}).then(function(staffcustomerList){
      controller.set('staffcustomerList',staffcustomerList);
    });
   //查询老人列表(有护理方案的老人)
   var customerList=new Ember.A();
   this.store.query('nursingproject',{}).then(function(nursingprojectList){
     nursingprojectList.forEach(function(obj){
       if(obj.get('customer')){
         customerList.pushObject(obj.get('customer'));
       }
     });
     customerList.forEach(function(customer){
       customer.set('namePinyin',customer.get('name'));
     });
     controller.set('customerList',customerList);
   });
   controller.set('customer',null);
  }
});
