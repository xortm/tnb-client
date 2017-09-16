import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  global_dataLoader: Ember.inject.service('data-loader'),
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'预定信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let _self = this;
    let filter = {};
    let allBedList = this.get('global_dataLoader.allBedList');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      let customerbusinessflowInfo = _self.store.peekRecord('customerbusinessflow',id);
      let bedList = allBedList.filter(function(bed){
        return bed.get('status.typecode')=='bedStatusIdle' ;
      });
      bedList.pushObject(allBedList.findBy('id',customerbusinessflowInfo.get('orderBed.id')));
      controller.set('bedList',bedList);
      controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
    }else{
      let bedList = allBedList.filter(function(bed){
        return bed.get('status.typecode') == 'bedStatusIdle';
      });
      controller.set('bedList',bedList);
      controller.set('customerbusinessflowInfo',_self.store.createRecord('customerbusinessflow',{}));
      controller.set('customer',_self.store.createRecord('customer',{}));
      controller.set('detailEdit',true);
    }

    this.store.query('employee',{}).then(function(staffList){
      staffList.forEach(function(staff){
        staff.set('namePinyin',pinyinUtil.getFirstLetter(staff.get("name")));
      });
      controller.set('staffList',staffList);
    });
  }
});
