import Ember from 'ember';
import BaseBusiness from '../base-business';
const {payStatus_processing,payType_apply,authenticate_succ,proportion_platform} = Constants;

/*
 * 角色管理
 * create by lmx
 */
export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'角色信息',
  model(){
    return {};
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      let roleInfo = this.store.peekRecord('role',id);
        controller.set('roleInfo',roleInfo);
        controller.set('roleInfo.detailEdit',false);
        controller.set("currentRole",controller.get('roleInfo'));

    }else{
      controller.set('detailEdit',true);
      controller.set('roleInfo',this.store.createRecord('role',{}));
      controller.set("currentRole",controller.get('roleInfo'));
    }

  },
});
