import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  infiniteContainerName:"evaluateContainerDetail",
  scrollPrevent:true,
  resultUserObs:function(){
    let _self = this;
    let id = this.get('resultId');
    let editMode = this.get('editModel');
    let newEva;
    let evaluate = this.get('feedService.evaluateModel');
    let questions = this.get('feedService.evaluateQuestions');
    let answerList = this.get('feedService.evaluateAnswers');
    if(!id){
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
       this.store.findRecord('evaluateresult',id).then(function(result){
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
             examerAnswer.set('editModel','add');
             answer.set('hasSelcted',false);
           }
           examerAnswer.set('answer',answer);
           examerAnswer.set('question',answer.get('question'));
           resultAnswers.pushObject(examerAnswer);
         });
         questionList.forEach(function(question,index){
           question.set('curIndex',index+1);
           let answers = resultAnswers.filter(function(answer){
             return answer.get('question.id') == question.get('id');
           })
           let indexList = ['A','B','C','D','E','F','G'];
           answers.forEach(function(answer,index){
             answer.set('curIndex',indexList[index]);
           })
           question.set('curanswers',answers);
         });
         evaluate.set('curquestionList',questionList);
         evaluate.set('resultUser',result.get('user'));
         evaluate.set('resultCreateTimeStr',result.get('createDateTimeString'))
         _self.set('evaluate',evaluate);
         _self.set('result',result);
         _self.set('resultAnswers',resultAnswers);
         _self.set('user',result.get('user'));
         _self.set('dateStr',result.get('createDateTimeString'));
       });
  }.observes('resultId','global_curStatus.healtyCustomer',"global_curStatus.evaresultChange").on('init'),
  actions:{
    chooseAnswer(answer){
      let resultAnswers = this.get('resultAnswers');
      let result = this.get('result');
      let curAnswer = resultAnswers.findBy('answer.id',answer.get('answer.id'));
      let elementId = "#eva-tem-mobile-" + answer.get('id');
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          if(answer.get('hasSelcted')){
            answer.set('hasSelcted',false);
            curAnswer.set('delStatus',1);
            curAnswer.set('hasSelcted',false);
            curAnswer.set('forRisk',1);
            curAnswer.save().then(function(){
            });
          }else{
            answer.set('hasSelcted',true);
            curAnswer.set('hasSelcted',true);
            curAnswer.set('delStatus',0);
            curAnswer.set('result',result);
            curAnswer.set('forRisk',1);
            curAnswer.save().then(function(){
            });
          }
        },100);
      },200);
    },
    //完成
    saveEva(){
      let _self = this;
      let elementId = "#eva-result-save";
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          let result = _self.get('result');
          let resultAnswers = _self.get('resultAnswers').filter(function(answer){
            return answer.get('hasSelcted') == true;
          });
          result.set('model',_self.get('evaluate'));
          result.set('customer',_self.get('global_curStatus.healtyCustomer'));
          result.set('answers',resultAnswers);
          result.get('answers').forEach(function(answer){
            answer.set('result',result);
          })
          if(resultAnswers.get('length')>0){
            result.set('completeStatus',1);
            result.save().then(function(){
               App.lookup("controller:business").popTorMsg("评估完成");
               _self.incrementProperty('global_curStatus.pageBackTime');
               _self.get("mainController").switchMainPage('evaluation-info');
            });
          }else{
             App.lookup("controller:business").popTorMsg("请答题");
          }
        },100);
      },200);
    },
    switchShowAction(){
      this.directInitScoll();
    },
    //跳转选择 self-choose
    toChoose: function(str,elementId) {
        let _self = this;
        let flag ;
        if(str=='user'){
          flag = 'staff';
        }
        if(str=='date'){
          flag = 'date'
        }
        let params = {
            source: str,
            resultId: _self.get('result.id'),
            editType: flag
        };
        let itemId = elementId;
        $("#" + itemId).addClass("tapped");
        Ember.run.later(function() {
            $("#" + itemId).removeClass("tapped");
            Ember.run.later(function() {
                let mainController = App.lookup("controller:business.mainpage");
                mainController.switchMainPage('evaluate-template-edit', params);
            }, 100);
        }, 200);
    },
  },
});
