import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  queryParams: {
    healtyCustomerId: {
        refreshModel: true
    },
  },
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '压疮护理(' + customerName +')';
  }),

  model() {
    return {};
  },
  setupController(controller, model){
    let _self = this;
    this.store.query('evaluateanswer',{filter:{question:{model:{riskAssessModel:{code:'pressureSores'},useFlag:0,delStatus:0}}}}).then(function(list){
      let questionList = new Ember.A();
      list.forEach(function(answer){
        if(!questionList.findBy('id',answer.get('question.id'))){
          questionList.pushObject(answer.get('question'));
        }
      });

      let evaluate ;
      questionList.forEach(function(question){
        evaluate = question.get('model');
      });
      _self.set('feedService.evaluateModel',evaluate);
      _self.set('feedService.evaluateQuestions',questionList);
      _self.set('feedService.evaluateAnswers',list);
      _self.set("global_pageConstructure.showLoader",false);
    });
    this.store.query('risk-record-model',{filter:{riskModel:{code:'pressureSores'}}}).then(function(riskList){
      controller.set('riskList',riskList);
      _self.set('feedService.recordModelList',riskList);
    });
    this._super(controller, model);
  },
});
