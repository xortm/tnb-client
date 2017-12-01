import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  global_dataLoader: Ember.inject.service('data-loader'),
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
    let modelSourceList = this.get('global_dataLoader.modelSourceList');
    let modelSource ;
    if(modelSourceList.findBy('modelSource.remark','qita')){
      modelSource = modelSourceList.findBy('modelSource.remark','qita').get('modelSource');
    }
    let tenantId = this.get('statusService.tenantId');
    if(tenantId == '111'){
      this.store.query('evaluatemodelsource',{}).then(function(sourceList){
        controller.set('modelSourceList',sourceList);
      });
    }

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
      let serviceLevelInfo = this.store.createRecord('nursinglevel',{});
      serviceLevelInfo.set('price',0);
      serviceLevelInfo.set('totalPrice',0);
      if(modelSource&&tenantId!=='111'){
        serviceLevelInfo.set('modelSource',modelSource);
      }
      controller.set('serviceLevelInfo',serviceLevelInfo);

      controller.set('hasServices',null);
    }


  }
});
