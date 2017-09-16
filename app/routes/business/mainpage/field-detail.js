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
      recordId: {
          refreshModel: true
      },
  },
  header_title:'表字段信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let recordId = this.getCurrentController().get('recordId');
    let riskInfo;
    let recordType = this.store.peekRecord('risk-record-model',recordId);
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      riskInfo = this.store.peekRecord('risk-record-field',id);

    }else{
      controller.set('detailEdit',true);
      riskInfo = this.store.createRecord('risk-record-field',{});
    }
    riskInfo.set('model',recordType);
    controller.set('riskInfo',riskInfo);
    this.store.query('risk-record-model',{}).then(function(typeList){
      typeList.forEach(function(type){
        type.set('namePinyin',pinyinUtil.getFirstLetter(type.get("name")));
      });
      controller.set('riskTypeList',typeList);
    });
    this.store.query('risk-record-field',{filter:{model:{id:recordId}}}).then(function(modelList){
      let list = new Ember.A();
      modelList.forEach(function(model){
        if(!model.get('parent.id')){
          list.pushObject(model);
        }
      });
      controller.set('parentList',list);
    });
  }
});
