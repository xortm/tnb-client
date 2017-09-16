import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedService: Ember.inject.service('feed-bus'),
  curStatus:Ember.inject.service('current-status'),
  header_title: Ember.computed("global_curStatus.healtyCustomerId",function() {
    let healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    let customerName = healtyCustomer.get("name");
    return '评估问卷(' + customerName +')';
  }),
  queryParams: {
    resultId:{
      refreshModel:true
    },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    this._super(controller, model);
    let _self = this;
    let editMode = this.getCurrentController().get('editModel');
    let newEva;
    let evaluate = this.get('feedService.evaluateModel');
    let questions = this.get('feedService.evaluateQuestions');
    let answerList = this.get('feedService.evaluateAnswers');
    if(editMode=='add'){//新增评估模板
      newEva = this.store.createRecord('evaluateresult',{});
      newEva.set('completeStatus',1);
      newEva.save().then(function(result){
        let resultAnswers = new Ember.A();
        let questionList = new Ember.A();
        answerList.forEach(function(answer){
          answer.set('hasSelcted',false);
          if(!questionList.findBy('id',answer.get('question.id'))){
            if(answer.get('question.model.id')==evaluate.get('id')){
              questionList.pushObject(questions.findBy('id',answer.get('question.id')));
            }
          }
          let examerAnswer = _self.store.createRecord('evaluateexameranswer',{});
          examerAnswer.set('answer',answer);
          examerAnswer.set('question',answer.get('question'));
          resultAnswers.pushObject(examerAnswer);
        });
        questionList.forEach(function(question,index){
          question.set('curIndex',index+1);
          let answers = answerList.filter(function(answer){
            return answer.get('question.id') == question.get('id');
          });
          let indexList = ['A','B','C','D','E','F','G'];
          answers.forEach(function(answer,index){
            answer.set('curIndex',indexList[index]);
            answer.set('hasSelcted',false);
          })

          question.set('curanswers',answers);
        });
        evaluate.set('curquestionList',questionList);
        controller.set('evaluate',evaluate);
        controller.set('result',result);
        controller.set('resultAnswers',resultAnswers);
        controller.set('user',result.get('user'));
        controller.set('dateStr',result.get('createDateTimeString'));
      });
    }

  },
});
