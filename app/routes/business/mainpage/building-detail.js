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
  header_title:'楼宇信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('building',id).then(function(buildingInfo){
        if(!(buildingInfo.get("downLandFloorNum"))){
          buildingInfo.set("downLandFloorNum",0);//设置默认为 0
        }
        if(buildingInfo.get("create4Flag")===1){// 1是不生成
          controller.set("cbState",true);
        }else {
          controller.set("cbState",false);
        }
        controller.set('buildingInfo',buildingInfo);

      });
    }else{
      var buildingInfo = this.store.createRecord('building',{});
      controller.set('buildingInfo',buildingInfo);
      controller.set('detailEdit',true);
      controller.set("cbState",false);
    }
  }
});
