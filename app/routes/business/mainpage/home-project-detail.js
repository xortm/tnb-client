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
  header_title:'居家项目详情',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    let serviceitemInfo = this.store.peekRecord('customerserviceitem',id);
    controller.set('serviceitemInfo',serviceitemInfo);
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.query('servicefinishlevel',{filter:{item:{id:id}}}).then(function(resultList){
        if(resultList.get('length')>0){
          controller.set('resultList',resultList);
        }else{
          controller.set('resultList',null);
        }
      });
      this.store.query('servicemerch',{filter:{item:{id:id}}}).then(function(merchs){
        controller.set('serviceitemInfo.merchList',merchs);
      });
    }else{

      controller.set('resultList',null);
      controller.set('detailEdit',true);
    }
    this.store.query('nursemerch',{}).then(function(merchList){
      controller.set('merchList',merchList);
    });

  }
});
