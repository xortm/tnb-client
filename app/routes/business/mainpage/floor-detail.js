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
  header_title:'楼层信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('floor',id).then(function(floorInfo){
        controller.set('floorInfo',floorInfo);
      });
    }else{
      controller.set('floorInfo',this.store.createRecord('floor',{}));
      controller.set('detailEdit',true);
    }
    this.store.query('building',{}).then(function(buildingList){
      controller.set('buildingList',buildingList);
      controller.set('buildingListFirst',buildingList.get('firstObject'));
    });

  }
});
