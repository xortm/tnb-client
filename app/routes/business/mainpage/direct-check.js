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
      from:{
        refreshModel:true
      },
      target:{
        refreshModel:true
      },
  },
  header_title:'入住客户信息确认',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let _self = this;
    let id = this.getCurrentController().get('id');
    let editMode = this.getCurrentController().get('editMode');
    if(editMode=="read"){
      controller.set('detailEdit',false);
      this.store.findRecord('customerbusinessflow',id).then(function(customerbusinessflowInfo){
        controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
      });

    }else{
      controller.set('detailEdit',true);
      let customerbusinessflowInfo;
      if(id){
        customerbusinessflowInfo = this.store.peekRecord('customerbusinessflow',id);
        if(customerbusinessflowInfo){
          customerbusinessflowInfo.set('checkInStartTimeDate',null);
          customerbusinessflowInfo.set('checkInEndTimeDate',null);
          customerbusinessflowInfo.set('checkInDateTime',null);
          customerbusinessflowInfo.set('bedPrice',customerbusinessflowInfo.get('bedPrice'));
          customerbusinessflowInfo.set('chargeType',customerbusinessflowInfo.get('chargeType'));
          let id = customerbusinessflowInfo.get("customer.id") ;
          //查询当前老人是否已有护理方案
          _self.store.query('nursingproject',{filter:{customer:{id:id}}}).then(function(projectList){
            let project = projectList.findBy('customer.id',id);
            let levelList = _self.get('global_dataLoader.serviceLevel');
            if(project){
              //当前老人已有护理方案，设置护理等级为已有方案的等级，设置护理等级为只读模式不可修改
              let level = levelList.findBy('id',project.get('level.id'));
              controller.set('customerbusinessflowInfo.nursinglevel',level);
              controller.set('customerbusinessflowInfo.levelPrice',customerbusinessflowInfo.get('levelPrice'));

              let rootId = _self.getCurrentController().get('id');
              if(rootId){
                controller.set('hasProject',true);
              }
            }else{
              controller.set('hasProject',false);
            }
          });
        }
      }else{
        customerbusinessflowInfo = this.store.createRecord('customerbusinessflow',{});
        let chargeType = this.get('global_dataLoader').findDict('chargeTypeY');
        customerbusinessflowInfo.set('chargeType',chargeType);
        customerbusinessflowInfo.set('couldCancel',true);
      }

      controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
    }
    //床位列表
    let allBedList = this.get('global_dataLoader.allBedList');
    controller.set('allBedList',allBedList);
    //护理等级列表
    let levelList = this.get('global_dataLoader.serviceLevel');
    controller.set('levelList',levelList);
    //状态列表
    let statusList = new Ember.A();
    let statusTry = this.get("global_dataLoader").findDict("customerStatusTry");
    let statusCheckin = this.get("global_dataLoader").findDict("customerStatusIn");
    statusList.pushObject(statusTry);
    statusList.pushObject(statusCheckin);
    controller.set('statusList',statusList);
    //员工列表
    this.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(staffList){
      staffList.forEach(function(staff){
        staff.set('namePinyin',pinyinUtil.getFirstLetter(staff.get("name")));
      });
      controller.set('staffList',staffList);
    });
    let target = this.getCurrentController().get('target');
    if(target=="toScheduled"){
      controller.set('scheduleInfo',true);
    }else{
      controller.set('scheduleInfo',false);
    }
    if(target=="direct"){
      controller.set('id',null);
      this.getCurrentController().set('from','check');
      let customerbusinessflowInfo = this.store.createRecord('customerbusinessflow',{});
      let chargeType = this.get('global_dataLoader').findDict('chargeTypeY');
      customerbusinessflowInfo.set('chargeType',chargeType);
      controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
      controller.set('hasProject',false);
      controller.set('tryToCheck',false);
    }else{
      // controller.set('isWeixin',true);
    }
    let from = this.getCurrentController().get('from');
    if(from=='try'&&editMode!=='read'){
      let customerbusinessflowInfo = controller.get('customerbusinessflowInfo');
      let status = this.get("global_dataLoader").findDict("customerStatusIn");
      controller.send('selectStatus',status);
      controller.set('tryToCheck',true);
      let chargeType = this.get('global_dataLoader').findDict('chargeTypeY');
      controller.set('customerbusinessflowInfo.chargeType',chargeType);
      controller.set('customerbusinessflowInfo.checkInStartTime',null);
      controller.set('customerbusinessflowInfo.checkInEndTime',null);
      controller.set('customerbusinessflowInfo.checkInDate',null);
      controller.set('customerbusinessflowInfo.bedPrice',customerbusinessflowInfo.get('checkInBed.totalPrice'));
      controller.set('customerbusinessflowInfo.diningStandardPrice',customerbusinessflowInfo.get('diningStandard.totalPrice'));
      controller.set('customerbusinessflowInfo.levelPrice',customerbusinessflowInfo.get('nursinglevel.totalPrice'));
      controller.set('customerbusinessflowModel.advWay',controller.get('customerbusinessflowInfo.advWay.firstObject'));
    }
    if(from=="scheduled"){
      controller.set('tryToCheck',false);
      if(editMode=="add"){
        controller.get('customerbusinessflowInfo').set('checkInBed',controller.get('customerbusinessflowInfo.orderBed'));
        controller.set('customerbusinessflowInfo.bedPrice',controller.get('customerbusinessflowInfo.orderBed.price'));
      }
    }
    let nav;
    if(target=="toScheduled"){
      nav = '预定信息';
    }
    if(target=="toCheckIn"||target=="toDetail"){
      nav = '入住信息';
    }
    if(target=="direct"){
      nav = '直接入住';
      controller.set('hasProject',false);
    }

    Ember.run.schedule('afterRender',function(){
      controller.send('nav',nav);
      let chargeType = controller.get('customerbusinessflowInfo.chargeType');
      if(chargeType.get('typecode')=="chargeTypeY"){
        controller.set('chargeMonth',true);
        controller.set('chargeDay',false);
      }
      if(chargeType.get('typecode')=="chargeTypeD"){
        controller.set('chargeMonth',false);
        controller.set('chargeDay',true);
      }
      console.log('入住偏好：',controller.get('customerbusinessflowInfo.inPreference'));
    });
  }
});
