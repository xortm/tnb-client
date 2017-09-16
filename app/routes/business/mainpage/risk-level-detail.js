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
      assessId: {
          refreshModel: true
      },
  },
  header_title:'风险等级信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let riskInfo;
    let assessType = this.store.peekRecord('risk-assess-model',this.getCurrentController().get('assessId'));
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      riskInfo = this.store.peekRecord('risk-level',id);

    }else{
      controller.set('detailEdit',true);
      riskInfo = this.store.createRecord('risk-level',{});
    }
    riskInfo.set('assess',assessType);
    controller.set('riskInfo',riskInfo);
    this.store.query('risk-assess-model',{}).then(function(typeList){
      typeList.forEach(function(type){
        type.set('namePinyin',pinyinUtil.getFirstLetter(type.get("name")));
      });
      controller.set('riskTypeList',typeList);
    });

  }
});
