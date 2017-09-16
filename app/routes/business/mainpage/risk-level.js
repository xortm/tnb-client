import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'风险等级列表',
  queryParams: {
      assessId: {
          refreshModel: true
      },
  },
  model() {
    return {};
  },


  setupController: function(controller,model){
    let assessId = controller.get('assessId');
    this.store.query('risk-level',{filter:{assess:{id:assessId}}}).then(function(riskList){
      controller.set('riskList',riskList);
      $('.pageLoading').remove();
    })
    let assessType = this.store.peekRecord('risk-assess-model',controller.get('assessId'));
    controller.set('assessTypeName',assessType.get('name'));
    this._super(controller,model);

  }
});
