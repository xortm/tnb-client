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
  header_title:'药品信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    this.store.query("drugFormType", {}).then(function(drugFormTypeList) {
        controller.set("drugFormTypeList0", drugFormTypeList);
        controller.set("formStatus0",drugFormTypeList.content.length>0);
    });
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('drug',id).then(function(drugInfo){
        controller.set('drugInfo',drugInfo);
      });
    }else{
      controller.set('drugInfo',this.store.createRecord('drug',{}));
      controller.set('defaultUnit',null);
      controller.set('detailEdit',true);
    }
  }
});
