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
      add:{
        refreshModel:true
      },
      from:{
        refreshModel:true
      }
  },
  dateService: Ember.inject.service("date-service"),
  header_title:'试住信息',
  model(){
    return{};
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let today = this.get('dateService').getCurrentTime();
    let minday = this.get('dateService').getCurrentTime()-86400;
    today = this.get("dateService").timestampToTime(today);
    minday = this.get("dateService").timestampToTime(minday);
    controller.set('today',today);
    controller.set('minday',minday);
    let customerbusinessflowInfo = this.store.peekRecord('customerbusinessflow',id);
    let allBedList = this.get('global_dataLoader.allBedList');
    let bedList = allBedList.filter(function(bed){
      return bed.get('status.typecode') == 'bedStatusIdle';
    });
    if(customerbusinessflowInfo.get('experienceBed.id')){
      bedList.pushObject(allBedList.findBy('id',customerbusinessflowInfo.get('experienceBed.id')));
    }else{
      bedList.pushObject(allBedList.findBy('id',customerbusinessflowInfo.get('orderBed.id')));
    }
    controller.set('bedList',bedList);
    console.log("oldBed route",customerbusinessflowInfo.get('customer.bed'));
    console.log("oldBed route business",customerbusinessflowInfo.get('orderBed'));
    controller.set('oldBed',customerbusinessflowInfo.get('customer.bed'));//转试住前床位
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
    this.store.query('employee',{}).then(function(staffList){
      staffList.forEach(function(staff){
        staff.set('namePinyin',pinyinUtil.getFirstLetter(staff.get("name")));
      });
      controller.set('staffList',staffList);
    });
  }
});
