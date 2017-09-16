import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'记录模板列表',
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
    this.store.query('risk-record-model',{filter:{riskModel:{id:assessId}}}).then(function(riskList){
      controller.set('riskList',riskList);
      $('.pageLoading').remove();
    });
    let assessType = this.store.peekRecord('risk-assess-model',controller.get('assessId'));
    controller.set('assessTypeName',assessType.get('name'));
    this._super(controller,model);

  }
});
