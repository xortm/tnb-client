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
      itemId:{
          refreshModel:true
      }
  },
  header_title:'执行情况信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let itemId = this.getCurrentController().get('itemId');
    controller.set('deviceProject',null);
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('dicttype',itemId).then(function(deviceInfo){
        controller.set('deviceInfo',deviceInfo);
      });
      let deviceTypeItem = this.store.peekRecord('deviceTypeItem',id);
      controller.set('deviceTypeItem',deviceTypeItem);
    }else{
      let deviceInfo = this.store.createRecord('dicttype',{});
      controller.set('deviceInfo',deviceInfo);
      controller.set('detailEdit',true);
    }
    this.store.query('devicetype',{}).then(function(devicetypeList){
      devicetypeList.forEach(function(devicetype){
        devicetype.set('namePinyin',pinyinUtil.getFirstLetter(devicetype.get("deviceName")));
      });
      controller.set('devicetypeList',devicetypeList);
    });

  }
});
