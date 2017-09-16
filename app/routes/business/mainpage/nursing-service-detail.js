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
      countT: {
          refreshModel: true
      },
  },
  detailEdit:true,
  header_title:'护理项目信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    var countT=this.getCurrentController().get('countT');
    if(countT){controller.set('count',true);}else {
      controller.set('count',false);
    }
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('customerserviceitem',id).then(function(serviceitemInfo){
        controller.set('serviceitemInfo',serviceitemInfo);
      });
    }else{
      controller.set('serviceitemInfo',this.store.createRecord('customerserviceitem',{}));
      controller.set('detailEdit',true);
    }

  }
});
