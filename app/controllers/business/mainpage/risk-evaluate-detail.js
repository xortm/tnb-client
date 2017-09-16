import Ember from 'ember';
import Changeset from 'ember-changeset';
import EvaValidations from '../../../validations/evaluatemodel';
import QuestionValidations from '../../../validations/evaluatequestion';
import AnswerValidations from '../../../validations/evaluateanswer';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(EvaValidations,{
  dataLoader: Ember.inject.service("data-loader"),
  queryCondition:'',
  questionInfo:Ember.Object.create({
    page_errors:Ember.Object.create({}),
  }),
  answerInfo:Ember.Object.create({
    page_errors:Ember.Object.create({}),
  }),
  seqLength:Ember.computed('questionList',function(){
    return this.get('questionList.length')+1;

  }),
  evaModel:Ember.computed('evaInfo',function(){
    var model = this.get("evaInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(EvaValidations), EvaValidations);
  }),
  questionModel:Ember.computed('curquestion',function(){
    var model = this.get("curquestion");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(QuestionValidations), QuestionValidations);
  }),
  sortObs: function(){
    let sortList = Ember.ArrayProxy.extend({
                    arrangedContent: Ember.computed.sort('content', 'props'),
                    props: ['seq:desc']
                }).create({
                    content: this.get("questionList")});
    this.set("sortQuestionList",sortList);
  }.observes("questionList.@each.seq"),

  seq:Ember.computed('sortQuestionList.@each.seq',function(){
    let seq;
    let firstOne = this.get('sortQuestionList').get('firstObject');
    if(firstOne){
      seq=firstOne.get('seq')+1;
    }else{
      seq=1;
    }
    return seq;
  }),
  curAnswer:null,
  curQuestion:null,
  detailEdit:false,
  serviceChangeModal:false,
  delEvaModal:false,
  canUse:Ember.computed('evaInfo.useFlag',function(){
    let a = this.get('evaInfo.useFlag');
    if(a===0){
      return true;
    }
  }),
  noUse:Ember.computed('evaInfo.useFlag',function(){
    let a = this.get('evaInfo.useFlag');
    if(a===1){
      return true;
    }
  }),
  constants: Constants,
  actions:{
    chooseStatus(value){
        this.set('evaInfo.useFlag',value);
    },
    //取消按钮
    detailCancel:function(){
      let id=this.get('id');
      let editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
      }else{
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('risk-evaluate');
      }

    },
    //弹窗取消按钮
    invitation(){
      this.set("detailQuestion",false);
      this.set('detailScoreScope',false);
    },
    //编辑按钮
    detailEditClick:function(){
      let id = this.get('id');
      let _self = this;
      this.store.query('evaluateresult',{}).then(function(resultlist){
        if(resultlist.findBy('model.id',id)){
          App.lookup('controller:business.mainpage').showAlert("此模板无法编辑");
        }else{
          _self.set('detailEdit',true);
        }
      });

    },

    //删除当前问卷弹框
    delPlan(eva){
      let id = this.get('id');
      let _self = this;
      this.store.query('evaluateresult',{}).then(function(resultlist){
        if(resultlist.findBy('model.id',id)){
          App.lookup('controller:business.mainpage').showAlert("此模板无法删除");
        }else{
          App.lookup('controller:business.mainpage').showConfirm("是否确定删除此模板记录",function(){
            _self.send('cancelPassSubmit',_self.get('evaInfo'));
          });
        }
      });
    },
    //删除问卷
    cancelPassSubmit(eva){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("delEvaModal",false);
      let model = this.store.peekRecord('evaluatemodel',eva.get('id'));
      model.set("delStatus", 1);
      model.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          let mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('risk-evaluate');

      });
		},
    delTheQuestion(){
      let _self = this;
      let chooseQuestionList = this.get('chooseQuestionList');
      if(chooseQuestionList){
        App.lookup('controller:business.mainpage').showConfirm("是否确定删除所选问题",function(){
          _self.send('delQuestion');
        });
      }else{
        App.lookup('controller:business.mainpage').showAlert("请选择要删除的问题！");
      }

    },
    //删除当前问题
    delQuestion(){
      let _self=this;
      let chooseQuestionList = this.get('chooseQuestionList');
      let questionList = this.get('questionList');
      let list = new Ember.A();
      questionList.forEach(function(question){
        list.pushObject(question);
      });
      list.removeObjects(chooseQuestionList);
      for(let i=0;i<list.get('length');i++){
        list.objectAt(i).set('seq',i+1);
      }
      this.set('questionList',list);
      this.set('chooseQuestionList',null);
    },
    invalid() {
    },
    //保存问卷信息
    savePlan(){
      this.get('dataLoader').disableClick();
      let _self = this;
      let editMode=this.get('editMode');
      let evaInfo=this.store.peekRecord('evaluatemodel',_self.get('evaInfo.id'));
      let evaModel = this.get('evaModel');
      let questionList = this.get('questionList');
      let questions = new Ember.A();
      let scoreScopes = new Ember.A();
      questionList.forEach(function(question){
        questions.pushObject(question);
      });
      evaModel.set('title',evaInfo.get('title'));
      evaModel.set('remark',evaInfo.get('remark'));
      evaInfo.set('questions',questions);
      if(!evaInfo.get('useFlag')){
        evaInfo.set('useFlag',0);
      }
      evaModel.validate().then(function(){
        if(questions.get('length') === 0){
          App.lookup('controller:business.mainpage').showAlert("问题数量不能为空！");
          _self.get('dataLoader').btnClick();
        }else{
          if(evaModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            if(editMode=='add'){
              evaInfo.set('delStatus',0);
              evaInfo.save().then(function(){
                //清除垃圾数据
                _self.store.unloadAll('evaluateanswer');
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                var route = App.lookup('route:business.mainpage.eva-plan-detail');
                let mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('risk-evaluate');
                _self.get('dataLoader').btnClick();
              });
            }else{
              evaInfo.save().then(function(){
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  _self.set('detailEdit',false);
                  _self.get('dataLoader').btnClick();
              });
            }
          }else{
            _self.get('dataLoader').btnClick();
            evaModel.set('validFlag',Math.random());
          }
        }

      });
    },
    //点击问题，弹层编辑
    detailQuestion(question){
      //重新定义一个question对象，用于承接数据
      let popQuestion = Ember.Object.create({});
      if(question){
        popQuestion.set("id",question.get("id"));
        popQuestion.set("seq",question.get("seq"));
        popQuestion.set("content",question.get("content"));
      }
      let _self = this;
      if(this.get('detailEdit')){
        this.set('detailQuestion',true);
        let answers = question.get('answers');
        let list = new Ember.A();
        let seq = ['A','B','C','D','E','F','G'];
        answers.forEach(function(answer){
          list.pushObject(answer);
        });
        for(let i=0;i<7;i++){
          if(!list.objectAt(i)){
            list.pushObject(_self.store.createRecord('evaluateanswer',{}));
          }
        }
        for(let i=0;i<7;i++){
          list.objectAt(i).set('curIndex',seq[i]);
        }
        popQuestion.set('allAnswerList',list);
        this.set('popQuestion',popQuestion);
      }
    },
    //新增问题
    addNewQuestion(){
      let _self = this;
      this.set('detailQuestion',true);
      let question = this.store.createRecord('evaluatequestion',{});
      let list = new Ember.A();
      let seq = ['A','B','C','D','E','F','G'];
      for(let i=0;i<7;i++){
        if(!list.objectAt(i)){
          list.pushObject(_self.store.createRecord('evaluateanswer',{

          }));
        }
      }
      for(let i=0;i<7;i++){
        list.objectAt(i).set('curIndex',seq[i]);
      }
      question.set('allAnswerList',list);
      question.set('create',true);
      question.set('order',_self.get('questionList.length')+1);
      this.set('popQuestion',question);
    },
    //保存编辑过后的问题和答案
    saveCurQuestion(){
      let questionList = this.get('questionList');
      let _self = this;
      let list = new Ember.A();
      let question = _self.get('popQuestion');
      let curquestion = null;
      if(question.get("id")){
        //如果是修改模式，则把弹窗里的内容复制回来
        curquestion = this.get("store").peekRecord("evaluatequestion",question.get("id"));
        curquestion.set("content",question.get("content"));
        curquestion.set("seq",question.get("seq"));
        curquestion.set("allAnswerList",question.get("allAnswerList"));
      }else{
        curquestion = question;
        curquestion.set('model',_self.get('evaInfo'));//新增的情况下把问题和模板挂接在一起
      }
      let num;
      if(this.get('popQuestion.curSeq')){
        num = this.get('popQuestion.curSeq');
      }else if(curquestion.get('seq')){
        num = curquestion.get('seq');
      }else if(curquestion.get('order')){
        num = curquestion.get('order');
      }
      let count = 0;
      //如果序号超过最大值，需要调整
      if(num>curquestion.get('order')){
        num = curquestion.get('order');
      }

      for(let i=num-1;i<questionList.get('length');i++){
        let seq = i+2;
        let q = questionList.objectAt(i);
        q.set('seq',seq);
      }
      curquestion.set('seq',num);
      let answerList = this.get('popQuestion.allAnswerList');
      //封装成可校验的对象
      let questionModel = new Changeset(curquestion, lookupValidator(QuestionValidations), QuestionValidations);
      //每个回答信息都进行校验
      answerList.forEach(function(answer){
        if(answer.get('content')){
          let answerModel = new Changeset(answer, lookupValidator(AnswerValidations), AnswerValidations);
          answerModel.set('content',answer.get('content'));
          answerModel.set('score',answer.get('score'));
          answer.set('answerModel',answerModel);
          list.pushObject(answer);
          answerModel.validate().then(function(){
            if(answerModel.get('errors.length')===0){
              count++;
            }else{
              answerModel.set("validFlag",Math.random());
            }
          });
        }
      });
      questionModel.validate().then(function(){
        _self.set("questionModel",questionModel);
        if(list.get('length')===0){
          App.lookup('controller:business.mainpage').showAlert("答案不能为空！");
        }
        if(questionModel.get('errors.length')===0){
          if(count==list.get('length')&&count>0){
            curquestion.set('answers',list);
            //校验通过后进行保存
            let newFlag = true;
            if(curquestion.get('id')){
              newFlag = false;
            }
            curquestion.save().then(function(questionData){
              //如果是新增，放入已有的问题列表
              if(newFlag){
                questionList.pushObject(curquestion);
              }
              _self.set('detailQuestion',false);
              let list = questionList.sortBy('seq');
              _self.set('questionList',list);
              let allAnswer = _self.store.peekAll("evaluateanswer");
              allAnswer.forEach(function(answer){
                if(!answer.get('id')&&!(answer.get('content'))){
                  answer.set('hasHidden',true);
                }else {
                }
              });
            });
          }
        }else{
          _self.get('dataLoader').btnClick();
          questionModel.set("validFlag",Math.random());
        }
      });
    },
    //选择问题
    chooseQuestion(question){
      let chooseQuestionList;
      if(this.get('chooseQuestionList')){
        chooseQuestionList = this.get('chooseQuestionList');
      }else{
        chooseQuestionList = new Ember.A();
      }
      if(question.get('hasSelected')){
        question.set('hasSelected',false);
        chooseQuestionList.removeObject(question);
      }else{
        chooseQuestionList.pushObject(question);
        question.set('hasSelected',true);
      }
      this.set('chooseQuestionList',chooseQuestionList);
    },

  }
});
