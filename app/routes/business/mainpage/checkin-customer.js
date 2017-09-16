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
      from:{
        refreshModel:true
      }
  },
  header_title:'入住客户信息确认',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let _self = this;
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
      this.store.findRecord('customerbusinessflow',id).then(function(customerbusinessflowInfo){
        controller.set('customerbusinessflowInfo',customerbusinessflowInfo);
        _self.store.findRecord('customer',customerbusinessflowInfo.get('customer.id')).then(function(customer){
          controller.set('customer',customer);
        });

      });

  }
});
