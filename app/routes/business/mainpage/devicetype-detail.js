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
  header_title:'硬件方案信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('devicetype',id).then(function(deviceInfo){
        controller.set('deviceInfo',deviceInfo);
      });
    }else{
      controller.set('deviceInfo',this.store.createRecord('devicetype',{}));
      controller.set('detailEdit',true);
    }

  }
});
