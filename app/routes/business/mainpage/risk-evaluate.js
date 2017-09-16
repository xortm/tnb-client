import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  header_title: "康复类评估模板",
  queryParams: {
      assessId: {
          refreshModel: true
      },
  },
  model() {
    return {};
  },
  setupController(controller, model){
    this._super(controller,model);
    this.store.query('evaluatemodel',{filter:{type:{typecode:'evaluateType1'},riskAssessModel:{id:controller.get('assessId')}}}).then(function(list){
      controller.set('evaList',list);
      $('.pageLoading').remove();
    });
    let assessType = this.store.peekRecord('risk-assess-model',controller.get('assessId'));
    controller.set('assessTypeName',assessType.get('name'));
  },
});
