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
  header_title:'物品信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      let merchInfo = this.store.peekRecord('nursemerch',id);
      controller.set('merchInfo',merchInfo);
    }else{
      var merchInfo = this.store.createRecord('nursemerch',{});
      controller.set('merchInfo',merchInfo);
      controller.set('detailEdit',true);
    }
  }
});
