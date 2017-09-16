import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  feedBus: Ember.inject.service("feed-bus"),
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
      add:{
        refreshModel:true
      },
      from:{
        refreshModel:true
      }
  },
  header_title:'入住信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let _self = this;
    var editMode=this.getCurrentController().get('editMode');
    let from=this.getCurrentController().get('from');
    var id=this.getCurrentController().get('id');
    let customerbusinessflowInfo = this.store.peekRecord('customerbusinessflow',id);
    let allBedList = this.get('global_dataLoader.allBedList');
    let bedList = allBedList.filter(function(bed){
      return bed.get('status.typecode') == 'bedStatusIdle';
    });
    if(editMode=='direct'){
      let customer = this.get('feedBus.checkInCustomer');
      let customerbusinessflow = this.store.createRecord('customerbusinessflow',{});
      controller.set('customerbusinessflowInfo',customerbusinessflow);
      controller.set('customer',customer);
      controller.set('isDirectIn',true);
      controller.set('checkIn',true);
      controller.set('bedList',bedList);
    }else{
      controller.set('oldBed',customerbusinessflowInfo.get('customer.bed'));//当前床位(为重新选择前的床位)
      if(customerbusinessflowInfo.get('checkInBed.id')){
        bedList.pushObject(allBedList.findBy('id',customerbusinessflowInfo.get('checkInBed.id')));
      }
      else if(customerbusinessflowInfo.get('experienceBed.id')){
        bedList.pushObject(allBedList.findBy('id',customerbusinessflowInfo.get('experienceBed.id')));
      }else{
        bedList.pushObject(allBedList.findBy('id',customerbusinessflowInfo.get('orderBed.id')));
      }
      controller.set('bedList',bedList);
      if(editMode=='edit'){
        _self.store.query('nursingproject',{filter:{customer:{id:customerbusinessflowInfo.get('customer.id')}}}).then(function(project){
          controller.set('project',project.get('firstObject'));
          controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
          controller.set('customer',customerbusinessflowInfo.get('customer'));
          controller.set('detailEdit',false);
        });
      }else{
        controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
        _self.store.query('nursingproject',{filter:{customer:{id:customerbusinessflowInfo.get('customer.id')}}}).then(function(project){
          controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
          controller.set('customer',customerbusinessflowInfo.get('customer'));
          controller.set('detailEdit',true);
          controller.set('project',project.get('firstObject'));
        });
      }
      //预定转入住加标识(解决预定转入住，经办人无法选择的问题)
      if(from=='try'){
        controller.set('tryFlag',true);
      }
    }
    //员工列表
    this.store.query('employee',{}).then(function(staffList){
      staffList.forEach(function(staff){
        staff.set('namePinyin',pinyinUtil.getFirstLetter(staff.get("name")));
      });
      controller.set('staffList',staffList);
    });
  }
});
