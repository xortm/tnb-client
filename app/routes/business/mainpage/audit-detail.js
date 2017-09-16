import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
  },
  header_title:'审核账单',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let id=this.getCurrentController().get('id');
    this.store.findRecord('customerbill',id).then(function(billInfo){
      controller.set('billInfo',billInfo);
    });

  }
});
