import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  mainController: Ember.inject.controller('business.mainpage'),
  nocustomerId:false,
  infiniteContainerName:"evaluationInfoContainer",
  scrollPrevent:true,
  customerObs: function(){
    let _self = this;
    let customerId = this.get("global_curStatus.healtyCustomerId");
    if(!customerId){
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    //取老人最近一次的评估模板
    let evaluate = this.get('feedService.evaluateModel');
    let resultList = new Ember.A();
    let nowResult = Ember.Object.create({});
    this.store.query('evaluateexameranswer',{filter:{result:{customer:{id:customerId},model:{id:evaluate.get('id')}},delStatus:0}}).then(function(allcusAnswerList){
      if(!allcusAnswerList){
        _self.hideAllLoading();
        return ;
      }
      let allAnswerList = new Ember.A();
      allcusAnswerList.forEach(function(answer){
        allAnswerList.pushObject(answer);
      });
      _self.set('feedService.allResultAnswers',allAnswerList);

      allAnswerList.forEach(function(answer){
        if(!resultList.findBy('id',answer.get('result.id'))){
          resultList.pushObject(answer.get('result'));
        }
      });
      resultList = resultList.filter(function(res){
        return res.get('delStatus')==0;
      })
      let result = resultList.sortBy('createDateTime').get('lastObject');//最近一次评估
      if(!result){
        _self.hideAllLoading();
        _self.set('nowResult',null);
        return ;
      }

      _self.set('result',result);
      let questionList = _self.get('feedService.evaluateQuestions');
      let answerList = _self.get('feedService.evaluateAnswers');
      let nowAnswerList = allAnswerList.filter(function(answer){//最近一次问卷所选中的答案列表
        return answer.get('result.id') == result.get('id');
      });
      _self.set('resultAnswers',nowAnswerList);
      answerList.forEach(function(answer){//与标准答案列表比对，将已有答案设为选中状态
        answer.set('hasSelcted',false);
        if(nowAnswerList.findBy('answer.id',answer.get('id'))){
          answer.set('hasSelcted',true);
        }
      });
      let nowQuestions = questionList.filter(function(question){//拼接问题列表
        if(answerList.findBy('question.id',question.get('id'))){
          let answers = answerList.filter(function(answer){
            return answer.get('question.id') == question.get('id');
          });
          question.set('answers',answers);
          return question;
        }
      });
      for(let i=0;i<nowQuestions.get('length');i++){//设置问题序号
        nowQuestions.objectAt(i).set('curIndex',i+1);
      }
      nowResult.set('title',evaluate.get('title'));
      nowResult.set('questions',nowQuestions);
      nowResult.set('resultId',result.get('id'));
      nowResult.set('user',result.get('user'));
      nowResult.set('createDateTime',result.get('createDateTime'));
      nowResult.set('createDateTimeString',result.get('createDateTimeString'));
      _self.set('nowResult',nowResult);
      _self.hideAllLoading();
      _self.directInitScoll(true);
      _self.incrementProperty('chooseAnswerComputed');
    });
  }.observes("global_curStatus.curResult","global_curStatus.healtyCustomerId","global_curStatus.pageBackTime").on("init"),

  scoreObs:function(){
    let list = new Ember.A();
    let allAnswerList = this.get('feedService.evaluateAnswers');
    let score = 0;
    allAnswerList.forEach(function(answer){
      if(answer.get('hasSelcted')){
        score += answer.get('score');
        list.pushObject(answer);
      }
    });
    this.set('score',score);
  }.observes('chooseAnswerComputed'),
  actions:{
    chooseAnswer(answer){
      let _self = this;
      let resultAnswers = this.get('resultAnswers');
      let result = this.get('result');
      let curAnswer = resultAnswers.findBy('answer.id',answer.get('id'));
      let elementId = "#eva-info-mobile-" + answer.get('id');
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          if(answer.get('hasSelcted')){//取消已选中的答案
            answer.set('hasSelcted',false);
            _self.incrementProperty('chooseAnswerComputed');
            curAnswer.set('delStatus',1);
            curAnswer.set('hasSelcted',false);
            curAnswer.set('forRisk',1);
            curAnswer.save().then(function(){
              _self.incrementProperty('chooseAnswerComputed');
            });
          }else{
            answer.set('hasSelcted',true);
            if(curAnswer){//以前有的答案，取消选中后再次选中
              curAnswer.set('hasSelcted',true);
              curAnswer.set('delStatus',0);
              curAnswer.set('result',result);
              curAnswer.set('forRisk',1);
              curAnswer.save().then(function(){
                _self.incrementProperty('chooseAnswerComputed');
              });
            }else{//新选中的答案
              curAnswer = _self.store.createRecord('evaluateexameranswer',{});
              curAnswer.set('answer',answer);
              curAnswer.set('question',answer.get('question'));
              curAnswer.set('result',result);
              curAnswer.set('hasSelcted',true);
              curAnswer.set('forRisk',1);
              curAnswer.save().then(function(answer){
                _self.get('resultAnswers').pushObject(answer);
                _self.incrementProperty('chooseAnswerComputed');
              });
            }
          }
        },100);
      },200);
    },
    //跳转选择 self-choose
    toChoose: function(str,elementId) {
        let _self = this;
        let flag ;
        if(str=='user'){
          flag = 'staff';
        }
        if(str=='date'){
          flag = 'date';
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
                mainController.switchMainPage('evaluate-edit-mobile', params);
            }, 100);
        }, 200);
    },
    addNewEva(result){
      let _self = this;
      let elementId = "#eva-add-result";
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          let newResult = _self.store.createRecord('evaluateresult',{});
          newResult.save().then(function(result){
          _self.get("mainController").switchMainPage('evaluate-template',{resultId:result.get('id')});
          });
        },100);
      },200);
    },
    switchShowAction(){
      this.directInitScoll();
    },
    toResultHistory(){
      let _self = this;
      let elementId = "#eva-view-history";
      $(elementId).addClass("tapped");
      Ember.run.later(function(){
        $(elementId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage('result-management');
          _self.incrementProperty('global_curStatus.evaluateComputed');
        },100);
      },200);
    },
  },
});
