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
      consultId: {
          refreshModel: true
      },
  },
  header_title:'咨询转预定',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    var consultId=this.getCurrentController().get('consultId');//漏写啦 delong欧巴
    console.log('editMode:',editMode);
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('customerbusinessflow',id).then(function(customerbusinessflowInfo){
        controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
        console.log('customerbusinessflowInfo:',customerbusinessflowInfo.get('advName'));
      });
    }
    if(editMode=='add'){
      let customerbusinessflowInfo = this.store.createRecord('customerbusinessflow',{});
      //------------如果咨询的id存在,则取咨询表里面的customer
      if(consultId){
        var consult= this.get("store").peekRecord("consultinfo", consultId);
        customerbusinessflowInfo.set('customerName',consult.get('customerName'));
        customerbusinessflowInfo.set('customerAddr',consult.get('customerAddr'));
        customerbusinessflowInfo.set('customerSelfCareAbility',consult.get('customerSelfCareAbility'));
        customerbusinessflowInfo.set('guardianFirstName',consult.get('advName'));
        customerbusinessflowInfo.set('guardianFirstContact',consult.get('advTel'));
        customerbusinessflowInfo.set('customerGender',consult.get('customerGender'));
        customerbusinessflowInfo.set('customerBrith',consult.get('customerBrith'));
        controller.set('detailEdit',true);
      }else{
        controller.set('detailEdit',true);
      }
      controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
}
    //床位列表
    let allBedList = this.get('global_dataLoader.allBedList');
    let bedList = allBedList.filter(function(bed){
      return bed.get('status.typecode') == 'bedStatusIdle';
    });
    controller.set('bedList',bedList);
    //员工列表
    this.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(staffList){
      staffList.forEach(function(staff){
        staff.set('namePinyin',pinyinUtil.getFirstLetter(staff.get("name")));
      });
      controller.set('staffList',staffList);
    });
  }
});
