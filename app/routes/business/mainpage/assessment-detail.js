import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
  },
  header_title:'床位信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let id = this.getCurrentController().get('id');
    let assessmentInfo = this.store.peekRecord('assessment',id);
    controller.set('assessmentInfo',assessmentInfo);
    this.store.query('assessment-indicator-result',{filter:{assessment:{id:id}}}).then(function(allAssessmentList){
      controller.set('allAssessmentList',allAssessmentList);
    });
  }
});
