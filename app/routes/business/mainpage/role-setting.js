import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      }
  },
  header_title:'角色护理项目信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
      this.store.findRecord('role',id).then(function(roleInfo){
        controller.set('roleInfo',roleInfo);
      });
    this.store.query('customerserviceitem',{}).then(function(serviceList){
      controller.set('serviceList',serviceList);
    });
  }
});
