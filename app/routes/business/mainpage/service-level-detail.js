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
  header_title:'护理等级信息',
  model(){
    return{};
  },
  setupController(controller,model){
    let _self = this;
    this._super(controller, model);
    let editMode=this.getCurrentController().get('editMode');
    let id=this.getCurrentController().get('id');
    this.store.query('customerserviceitem',{sort:{name:'asc'}}).then(function(services){
      _self.getCurrentController().set("serviceList", services);
    });


    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('nursinglevel',id).then(function(serviceLevelInfo){
        controller.set('serviceLevelInfo',serviceLevelInfo);
        _self.store.query('nursinglevelitem',{filter:{level:{id:id}}}).then(function(serviceList){
          controller.set('hasServices',serviceList);
        });
      });
    }else{
      controller.set('detailEdit',true);
      controller.set('serviceLevelInfo',this.store.createRecord('nursinglevel',{}));
      controller.set('hasServices',null);
    }
    

  }
});
