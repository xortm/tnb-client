import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
  },
  header_title:'检查详情',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var id=this.getCurrentController().get('id');
    let serviceCheckInfo = this.store.peekRecord('servicecheck',id);
    controller.set('serviceCheckInfo',serviceCheckInfo)
  }
});
