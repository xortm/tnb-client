import Ember from 'ember';
import BaseBusiness from '../base-business';
const { taskStatus_begin,taskStatus_isPassed,taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail,taskApplyStatus_invited,taskApplyStatus_SuccNotLocateSeat,taskApplyStatus_refuseInvitation} = Constants;

export default BaseBusiness.extend({
  pageyModelListName: "content",
  feedBus: Ember.inject.service('feed-bus'),
  header_title: "压疮评估问卷",
  queryParams: {
    id: {
        refreshModel: true
    },
  },

  model() {
    return {};
  },
  setupController(controller, model){
    var _self = this;
    this._super(controller, model);
    let id = this.getCurrentController().get('id');
    let evaluate = this.get('feedBus.evaluateModel');
    console.log('模板名称',evaluate.get('title'));
    let questions = this.get('feedBus.evaluateQuestions');
    let answerList = this.get('feedBus.evaluateAnswers');
    //取出该问卷的所有答案，拼接问题答案列表
    this.store.query('evaluateexameranswer',{filter:{result:{id:id}}}).then(function(resultList){

      let result = _self.store.peekRecord('evaluateresult',id);
      console.log('已有答案',result.get('answers'));
      let resultAnswers = new Ember.A();
      let questionList = new Ember.A();
      answerList.forEach(function(answer){
        answer.set('hasSelcted',false);
        if(!questionList.findBy('id',answer.get('question.id'))){
          if(answer.get('question.model.id')==evaluate.get('id')){
            questionList.pushObject(questions.findBy('id',answer.get('question.id')));
          }
        }
        let examerAnswer ;
        if(result.get('answers').findBy('answer.id',answer.get('id'))){
          examerAnswer = result.get('answers').findBy('answer.id',answer.get('id'));
          answer.set('hasSelcted',true);
          examerAnswer.set('hasSelcted',true);
        }else{
          examerAnswer = _self.store.createRecord('evaluateexameranswer',{});
        }
        examerAnswer.set('answer',answer);
        examerAnswer.set('question',answer.get('question'));
        resultAnswers.pushObject(examerAnswer);
      });
      questionList.forEach(function(question,index){
        question.set('curIndex',index+1);
        let answers = answerList.filter(function(answer){
          return answer.get('question.id') == question.get('id');
        })
        question.set('answers',answers);
      });
      evaluate.set('questionList',questionList);
      evaluate.set('score',result.get('score'));
      evaluate.set('user',result.get('user'));
      evaluate.set('lastUpdateDateTimeString',result.get('lastUpdateDateTimeString'));
      evaluate.set('customer',result.get('customer'));
      evaluate.set('hasSelcted',false);
      evaluate.set('hasShow',false);
      controller.set('evaluate',evaluate);
    });
  },
});
