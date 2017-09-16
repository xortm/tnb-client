import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title:'记录模板列表',
  queryParams: {
      recordId: {
          refreshModel: true
      },
  },
  model() {
    return {};
  },
  setupController: function(controller,model){
    let recordId = controller.get('recordId');
    this.store.query('risk-record-field',{filter:{model:{id:recordId}}}).then(function(riskList){
      controller.set("allRiskList", riskList);
      $('.pageLoading').remove();
    });
    let assessType = this.store.peekRecord('risk-record-model',controller.get('recordId'));
    controller.set('assessTypeName',assessType.get('name'));
    this._super(controller,model);

  }
});
