import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import evaValidations from '../../validations/eva-detail';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(evaValidations, {
    globalCurStatus: Ember.inject.service('current-status'),
    changeFlag: 0,
    hasChoosed: true,
    afterFlag: false,
    saveInfo: true,
    stopLoop:false,
    modelID: "",
    answerId: "",
    constants: Constants,
    allSaveList: new Ember.A(),
    //allresultList: new Ember.A(),
    //selectQuestionObj: {},
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    feedBus: Ember.inject.service("feed-bus"),
    realAnswerList: new Ember.A(),
    today:Ember.computed(function(){
      let today = this.get('dateService').getCurrentTime();
      today = this.get("dateService").timestampToTime(today);
      return today;
    }),
    didInsertElement:function() {
      //alert('didInsertElement');
      this.set('saveResult',false);
       console.log('每次进来时allresultList是',this.get('allresultList'));
        var _self = this;
        //通过evaluate查询到result
        if (!this.get('addMode')) {
          //alert('详情页');
            var useModelList = new Ember.A();
            this.get("store").query('evaluateresult', {
                filter: {
                    '[evaluateBatch][id]': _self.get('evaluate.id')
                }
            }).then(function(resultList) {
              _self.set('detailResultList',resultList);
                resultList.forEach(function(resultObject) {
                  console.log('level.id is',resultObject.get('level.id'));
                    var levelName=resultObject.get('level.name');
                    console.log('level.name is',levelName);
                    resultObject.get('model').set('level',levelName);
                    useModelList.pushObject(resultObject.get('model'));
                });
                //详情页默认展开第一个模板
                _self.set('useModelList', useModelList);
                _self.get('useModelList').forEach(function(useModel){
                  useModel.set('hasShow',false);
                });
                _self.get('useModelList').get('firstObject').set('hasShow',true);
                var firstId=_self.get('useModelList').get('firstObject.id');
                console.log('firstId is',firstId);
                _self.set('modelID',firstId);
                //根据modelID查询对应的:模板分数范围
                useModelList.forEach(function(useModel) {
                    //查询答卷，计算分数
                    _self.get('store').query('evaluateexameranswer', {
                        filter: {
                            result: {
                                '[model][id]': useModel.get('id'),
                                // '[customer][id]': _self.get('evaluate.customer.id')
                                '[evaluateBatch][id]': _self.get('evaluate.id')
                            }
                        }
                    }).then(function(answersList) {
                        console.log('evaluateexameranswer:answersList', answersList);
                        var scores = null;
                        answersList.forEach(function(answer) {
                            var realAnswer = answer.get('answer');
                            console.log('answer.answer+++++', answer.get('answer'));
                            var score = realAnswer.get('score');
                            if(!score){
                              score=0;
                            }
                            console.log('evaluateexameranswer:score', score);
                            scores += score;
                            console.log('scores+=score;', scores);
                            console.log('answer对应的result',answer.get('result'));
                        });
                        useModel.set('scores', scores);
                        //根据得分筛选护理等级
                        // var scorescopes = useModel.get('scorescopes');
                        // console.log('scorescopes is+++', scorescopes);
                        // scorescopes.forEach(function(scorescope) {
                        //     console.log('minScore is', scorescope.get('minScore'));
                        //     if (scores > scorescope.get('minScore') && scores < scorescope.get('maxScore')) {
                        //         useModel.set('level', scorescope.get('level'));
                        //     }
                        // });
                    });
                });
            });
        }else {
          let getuseModelList = this.get("feedBus").get("threadData");
          console.log('getuseModelList is',getuseModelList);
          //重建modelList
          let useModelList=new Ember.A();
          getuseModelList.forEach(function(useModel){
            useModel.set('selectList',false);
            let model = useModel;
            useModelList.pushObject(model);
          });
          this.set('useModelList',useModelList);
          console.log('evaluate-question-detail:useModelList',this.get('useModelList'));
          this.get('useModelList').forEach(function(useModel) {
                  useModel.set('hasShow', false);
          });
        }
    },
    evaModelObs: function() {
        var model = this.get("evaluate");
        console.log("model evaluate", model);
        if (!model) {
            return null;
        }
        this.set("evaModel", new Changeset(model, lookupValidator(evaValidations), evaValidations));
        //this.questionListProcess();
    }.observes("changeFlag").on('init'),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.evaluate-question');
        route.refresh();
    },
    detailModify: Ember.computed("addMode", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
    }),
    questionListProcess: function() {
        //alert('questionListProcess');
        console.log('questionListProcess:modelID is', this.get('modelID'));
        // if (!this.get("modelID")) {
        //     return;
        // }
        if(this.get('addMode')){
          return;
        }
        var _self = this;
         let modelID = this.get("modelID");
         let selectQuestionObj=this.get('selectQuestionObj');
         if(selectQuestionObj[modelID]){
           this.set('realQuestionList',selectQuestionObj[modelID]);
           console.log('selectQuestionObj[modelID]==realQuestionList',this.get('realQuestionList'));
           return;
         }else {
           selectQuestionObj[modelID]=new Ember.A();
           this.set('realQuestionList',selectQuestionObj[modelID]);
           console.log('new Ember.A();==realQuestionList',this.get('realQuestionList'));
         }
        //--------------------------------------------
        //var realQuestionList = new Ember.A();
        //this.set("realQuestionList", realQuestionList);
        var answers = new Ember.A();
        this.set("myAnswer", answers);
        this.get("store").query("evaluateexameranswer", {
            filter: {
                result: {
                    "[model][id]": this.get("modelID"),
                    '[evaluateBatch][id]': this.get('evaluate.id')
                }
            }
        }).then(function(retAnswerList) {
            var index = 0;
            var len = retAnswerList.get("length");
            console.log("sheet len", len);
            console.log("retAnswerList is", retAnswerList);
            retAnswerList.forEach(function(answer) {
                console.log("answer id:" + answer + " and answer.id：" + answer.get("answer.id"));
                answer.set("answerId", answer.get("answer.id"));
                _self.get("myAnswer").pushObject(answer);
                index++;
                if (index >= len) {
                    _self.doQuery();
                }
            });
        });
    }.observes("modelID"),
    doQuery: function() {
      //alert('doQuery');
        var _self = this;
        var filter = {};
        if (this.get('modelID')) {
            console.log('doQuery:modelID is', this.get('modelID'));
            filter = $.extend({}, filter, {
                question: {
                    '[model][id]': this.get('modelID')
                }
            });
        }
        //通過question的id去查到对应的answer
        this.get("store").query('evaluateanswer', {
            filter: filter,
        }).then(function(answerList) { //answerList标准答案
            console.log("sheet normal answerList is", answerList);
            var questionOri = null;
            var realIndex = 1;
            var answerFlag = 1;
            var answerIndex = "A";
            var curUser = _self.get("globalCurStatus").getUser();
            _self.get("store").findRecord('user', curUser.get("id")).then(function(user) { //通过创建人id查询createUser
                answerList.forEach(function(answer) { //循环出每一条标准的答案
                    //构造问题
                    var questionReal = answer.get("question"); //循环得到的每一个问题(有重复的)
                    console.log("questionReal is", questionReal);
                    answer.set("hasSelcted", false);
                    //console.log("realQuestionList isis", _self.get("realQuestionList"));
                    if (!questionOri || questionReal.get("id") !== questionOri.get("id")) {
                        questionOri = questionReal;
                        questionReal.set("realIndex", realIndex);
                        realIndex++;
                        answerFlag = 1;
                        answerIndex = "A";
                        answer.set("answerIndex", answerIndex);
                        console.log("answerIndex", answerIndex);

                        console.log("sheet questionOri is", questionOri);
                        console.log("sheet questionReal is", questionReal);
                        _self.get("realQuestionList").pushObject(questionOri);
                        console.log("realQuestionList isiswhat", _self.get("realQuestionList"));
                        questionReal.set("answerList", new Ember.A());
                        console.log("questionReal id:" + questionReal.get("id") + " and push answer:" + answer.get("id") + " and list size:" + questionReal.get("answerList").get('length'));
                        questionReal.get("answerList").pushObject(answer);
                        questionReal.reopen({
                            curAnswerId: null,
                            curAnswerObs: function() {
                                var _selfReal = this;
                                console.log("curAnswerId is", _selfReal.get("curAnswerId"));
                                this.get("answerList").forEach(function(answer) {
                                    if (answer.get("id") !== _selfReal.get("curAnswerId")) {
                                        answer.set("hasSelcted", false);
                                    } else {
                                        answer.set("hasSelcted", true);
                                        console.log("match answer id is", answer);
                                        questionReal.get("answermodel").set("answerId", answer.get("id"));
                                        questionReal.get("answermodel").set("answer", answer);
                                        console.log("answermodel in question after", questionReal.get("answermodel"));
                                    }
                                });
                            }.observes("curAnswerId").on("init"),
                        });

                    } else {
                        console.log("questioniru id:" + questionOri.get("id") + " and push answer:" + answer.get("id"));
                        questionOri.get("answerList").pushObject(answer);
                        if (answerFlag == 1) {
                            answerIndex = "A";
                        }
                        answerFlag++;
                        if (answerFlag == 2) {
                            answerIndex = "B";
                        }
                        if (answerFlag == 3) {
                            answerIndex = "C";
                        }
                        if (answerFlag == 4) {
                            answerIndex = "D";
                        }
                        if (answerFlag == 5) {
                            answerIndex = "E";
                        }
                        answer.set("answerIndex", answerIndex);
                    }
                    let answermodel = null;
                    if (!_self.get("id")) {
                        answermodel = _self.get("store").createRecord('evaluateexameranswer', {
                            question: questionReal,
                            answer: null,
                            result: _self.get("evaluateresult"),
                            createUser: user,
                            lastUpdateUser: user
                        });
                        questionOri.set("answermodel", answermodel);
                    } else {
                        answermodel = _self.get("myAnswer").findBy("answerId", answer.get("id"));
                        if (answermodel) {
                            console.log("answerid get", answer.get("id"));
                            questionOri.set("answermodel", answermodel);
                            questionOri.set("curAnswerId", answermodel.get("answerId"));
                        } else {
                            answermodel = _self.get("store").createRecord('evaluateexameranswer', {
                                question: questionOri,
                                answer: null,
                                result: _self.get("evaluateresult"),
                                createUser: user,
                                lastUpdateUser: user
                            });
                            questionOri.set("answermodel", answermodel);
                        }
                        console.log("answermodel get", questionOri.get("answermodel"));
                    }
                });
                _self.set("afterFlag", true);
                console.log('this afterFlag is', _self.get('afterFlag'));
            });
        });
    },
    obs: function() {
      //alert('obs');
        var _self = this;
        if (this.get('afterFlag')) {
            //alert('doQuery执行完毕,obs正式执行');
            var answersList = new Ember.A(); //选择的答案
            console.log('++++realQuestionList is++++', this.get('realQuestionList'));
            this.get('realQuestionList').forEach(function(questionReal) {
                console.log('+++questionReal is+++:', questionReal);
                var answermodel = questionReal.get("answermodel");
                //answermodel.set("answer", answermodel.get("answertemp"));
                answersList.pushObject(answermodel);
                console.log('+++answermodel is++++:', answermodel);
            });
            if (!this.get('addMode')) { //详情查询evaluateresult
                //alert('执行几次');
                this.get("store").query('evaluateresult', {
                    filter: {
                        '[evaluateBatch][id]': _self.get('evaluate.id'),
                        '[model][id]': _self.get('modelID')
                    }
                }).then(function(resultList) {
                    var resultObj = resultList.get('firstObject');
                    resultObj.set('answers', answersList);
                    _self.get('allresultList').pushObject(resultObj);
                    console.log('obs:allresultList is', _self.get('allresultList'));
                });
                return;
            }
            //添加界面
            this.get('evaluateresult').set('answers', answersList);
            console.log('+++answers++++', this.get('evaluateresult.answers'));
            this.get('allresultList').pushObject(this.get('evaluateresult'));
            console.log('allresultList is', this.get('allresultList'));

            var modelName = this.get('model.title');
            var selectQuestionObj = this.get('selectQuestionObj');
            selectQuestionObj[modelName] = this.get('realQuestionList');
            this.set('selectQuestionObj', selectQuestionObj);
            console.log('selectQuestionObj+++++', this.get('selectQuestionObj'));
        }
    }.observes("afterFlag"),
    actions: {
        invalid() {},
        //修改
        detailModifyClick: function() {
            this.set('detailModify', true);
        },
        //保存按钮
        detailSaveClick: function() {
          //alert('保存');
            var _self = this;
            var evaModel = this.get("evaModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            if(_self.get('addMode')){
              evaModel.set('customer', this.get('customerObj'));
            }
            var useModelList=this.get('useModelList');
                evaModel.validate().then(function() {
                    if (evaModel.get('errors.length') === 0) {
                      _self.set('saveInfo',true);
                      _self.set('stopLoop',false);
                      console.log('saveInfo4',_self.get('saveInfo'));
                      if(_self.get('addMode')){
                        //判断是否答题完整
                        var selectQuestionObj=_self.get('selectQuestionObj');
                        var useModelList=_self.get('useModelList');
                        useModelList.forEach(function(useModel){
                          var modelName=useModel.get('title');
                          var questionList=selectQuestionObj[modelName];
                          if(_self.get('stopLoop')){
                            console.log('stopLoop1',_self.get('stopLoop'));
                            return;
                          }
                          if(questionList){
                            console.log('save:questionList is',questionList);
                            questionList.forEach(function(questionReal){
                              //alert('questionList进来了');
                              if(_self.get('stopLoop')){
                                return;
                              }
                              var answermodel=questionReal.get('answermodel');
                              console.log('save:answermodel is',answermodel);
                              console.log('save:answermodel:answer is',answermodel.get('answer'));
                              if(!answermodel.get('answer.content')){
                                _self.set('saveInfo',false);//禁止保存
                                console.log('saveInfo3',_self.get('saveInfo'));
                                //alert('您有未答题的模板，请完成答题！');
                                useModel.set('errorClass',true);//标红字体
                                //useModel.set('hasShow',true);
                                _self.set("modelID", useModel.get('id'));
                                _self.set("model", useModel);
                                _self.send('selectModel',useModel);
                                console.log('当前的model是',useModel);
                                _self.set('stopLoop',true);
                                return;
                              }else {
                                useModel.set('errorClass',false);
                                useModel.set('hasShow',false);
                                _self.set('saveInfo',true);
                                console.log('saveInfo5',_self.get('saveInfo'));
                              }
                            });
                          }else {
                            _self.set('saveInfo',false);//禁止保存
                            console.log('saveInfo1',_self.get('saveInfo'));
                            //alert('您有未答题的模板，请完成答题！');
                            useModel.set('errorClass',true);//标红字体
                            _self.set("modelID", useModel.get('id'));
                            _self.set("model", useModel);
                            _self.send('selectModel',useModel);
                            _self.set('stopLoop',true);
                            return;
                          }
                          });
                      }
                      if(!_self.get('saveInfo')){
                        console.log('saveInfo2',_self.get('saveInfo'));
                        return;
                      }
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        console.log("sheet evaModel is", evaModel);
                       evaModel.save().then(function() {
                          console.log('所有的allresultList是',_self.get('allresultList'));
                            _self.get('allresultList').forEach(function(result) {
                                result.set('customer', _self.get('evaModel.customer'));
                                //计算分数
                                var scores = null;
                                result.get('answers').forEach(function(answer) {
                                    var realAnswer = answer.get('answer');
                                    console.log('answer.answer+++++', answer.get('answer'));
                                    var score = realAnswer.get('score');
                                    console.log('evaluateexameranswer:score', score);
                                    scores += score;
                                    console.log('scores+=score;', scores);
                                    console.log('answer对应的result',answer.get('result'));
                                });
                                result.set('score', scores);
                                //计算护理等级
                                _self.get('store').query('evaluatescorescope',{filter:{
                                  'maxScore@$gte': scores,
                                  'minScore@$lte': scores,
                                  '[model][id]':result.get('model.id')
                                },
                              }).then(function(scopeList){
                                console.log('护理等级是',scopeList.get('firstObject.level.name'));
                                  result.set('level',scopeList.get('firstObject.level'));
                                  if(!_self.get('saveResult')){
                                    App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                    _self.didInsertElement();
                                    if (_self.get('addMode')) {
                                        mainpageController.switchMainPage('evaluate-question', {});
                                    }
                                    _self.set('detailModify', false);
                                    return;
                                  }
                                  result.save().then(function() {
                                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                      _self.didInsertElement();
                                      if (_self.get('addMode')) {
                                          mainpageController.switchMainPage('evaluate-question', {});
                                      }
                                      _self.set('detailModify', false);
                                  });
                                });

                            });
                        });
                    } else {
                        evaModel.set("validFlag", Math.random());
                        //alert("校验失败");
                    }
                });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("evaluate").rollbackAttributes();
                this.set("evaModel", new Changeset(this.get("evaluate"), lookupValidator(evaValidations), evaValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('evaluate-question', {
                    //flag: 'edit-add'
                });
            }
        },
        //删除按钮
        delById: function() {
            var evaluate=this.get('evaluate');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此问卷", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                evaluate.set("delStatus", 1);
                evaluate.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('evaluate-question');
                });
            });
        },
        changeCreateDateAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("evaModel.createDateTime", stamp);
        },
        //评估人
        selectParent(user) {
            this.get('evaModel').set("user", user);
            this.set("parent", user);
        },
        //模板
        selectModel(model) {
          //alert('selectModel');

            var _self = this;
            this.set("modelID", model.get('id'));
            this.set("model", model);
            if(model.get('hasShow')){
              return;
            }
            model.set('hasShow', true); //显示答题标识
            this.set('afterFlag', false); //标识doQuery是否执行完毕
            this.get('useModelList').forEach(function(useModel) {
                if (useModel !== model) {
                    useModel.set('hasShow', false);
                }
            });
            if (!this.get('addMode')) { //详情
                //alert('详情里面点击');

            } else { //添加
                let modelName = model.get('title');
                if (model.get('selectList')) { //如果是之前点击的模板,则从对象selectQuestionObj里面找到
                  //alert('之前点击过了');
                    var selectQuestionObj = this.get('selectQuestionObj');
                    var questionList = selectQuestionObj[modelName];
                    console.log('questionList+++++', questionList);
                    this.set('realQuestionList', questionList);
                    return;
                }
                model.set('selectList', true); //标识
                if (!model) {
                    return;
                }
                var realQuestionList = new Ember.A();
                this.set("realQuestionList", realQuestionList);
                this.set('evaluateresult', this.get('store').createRecord('evaluateresult', {
                    model: model,
                    evaluateBatch: _self.get('evaluate')
                }));
                //alert('在执行doQuery');
                this.doQuery();
                //批存(answersList)
                console.log('++++afterFlag+++', this.get('afterFlag'));
            }

        },
        chooseAnswer(answer, question) {
          //alert('chooseAnswer');
            if (this.get("detailModify")) {
                this.set('saveInfo',true);//禁止保存标识
                var curAnswerId = answer.get("id");
                console.log("curAnswerId is:" + curAnswerId);
                question.set("curAnswerId", curAnswerId);
                this.set('saveResult',true);//标识是否要保存result(编辑的时候重新勾选答案的话不需要循环allresultList去保存)
            }
        },
    }
});
