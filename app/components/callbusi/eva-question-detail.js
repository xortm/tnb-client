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
      this.set('saveResult',false);
        var _self = this;
        //通过evaluate查询到result
        if (!this.get('addMode')) {
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
                _self.set('modelID',firstId);
                //根据modelID查询对应的:模板分数范围
                useModelList.forEach(function(useModel) {
                    //查询答卷，计算分数
                    _self.get('store').query('evaluateexameranswer', {
                        filter: {
                            result: {
                                '[model][id]': useModel.get('id'),
                                '[evaluateBatch][id]': _self.get('evaluate.id')
                            }
                        }
                    }).then(function(answersList) {
                        var scores = null;
                        answersList.forEach(function(answer) {
                            var realAnswer = answer.get('answer');
                            var score = realAnswer.get('score');
                            if(!score){
                              score=0;
                            }
                            scores += score;
                        });
                        useModel.set('scores', scores);
                    });
                });
            });
        }else {
          let getuseModelList = this.get("feedBus").get("threadData");
          //重建modelList
          let useModelList=new Ember.A();
          getuseModelList.forEach(function(useModel){
            useModel.set('selectList',false);
            let model = useModel;
            useModelList.pushObject(model);
          });
          this.set('useModelList',useModelList);
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
    }.observes("changeFlag").on('init'),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.eva-question');
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
        if(this.get('addMode')){
          return;
        }
        var _self = this;
         let modelID = this.get("modelID");
         let selectQuestionObj=this.get('selectQuestionObj');
         if(selectQuestionObj[modelID]){
           this.set('realQuestionList',selectQuestionObj[modelID]);
           return;
         }else {
           selectQuestionObj[modelID]=new Ember.A();
           this.set('realQuestionList',selectQuestionObj[modelID]);
         }
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
            retAnswerList.forEach(function(answer) {
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
                    if (!questionOri || questionReal.get("id") !== questionOri.get("id")) {
                        questionOri = questionReal;
                        questionReal.set("realIndex", realIndex);
                        realIndex++;
                        answerFlag = 1;
                        answerIndex = "A";
                        answer.set("answerIndex", answerIndex);
                        _self.get("realQuestionList").pushObject(questionOri);
                        questionReal.set("answerList", new Ember.A());
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
                    }
                });
                _self.set("afterFlag", true);
            });
        });
    },
    obs: function() {
        var _self = this;
        if (this.get('afterFlag')) {
            var answersList = new Ember.A(); //选择的答案
            this.get('realQuestionList').forEach(function(questionReal) {
                var answermodel = questionReal.get("answermodel");
                answersList.pushObject(answermodel);
            });
            if (!this.get('addMode')) { //详情查询evaluateresult
                this.get("store").query('evaluateresult', {
                    filter: {
                        '[evaluateBatch][id]': _self.get('evaluate.id'),
                        '[model][id]': _self.get('modelID')
                    }
                }).then(function(resultList) {
                    var resultObj = resultList.get('firstObject');
                    resultObj.set('answers', answersList);
                    _self.get('allresultList').pushObject(resultObj);
                });
                return;
            }
            //添加界面
            this.get('evaluateresult').set('answers', answersList);
            this.get('allresultList').pushObject(this.get('evaluateresult'));
            var modelName = this.get('model.title');
            var selectQuestionObj = this.get('selectQuestionObj');
            selectQuestionObj[modelName] = this.get('realQuestionList');
            this.set('selectQuestionObj', selectQuestionObj);
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
                      if(_self.get('addMode')){
                        //判断是否答题完整
                        var selectQuestionObj=_self.get('selectQuestionObj');
                        var useModelList=_self.get('useModelList');
                        useModelList.forEach(function(useModel){
                          var modelName=useModel.get('title');
                          var questionList=selectQuestionObj[modelName];
                          if(_self.get('stopLoop')){
                            return;
                          }
                          if(questionList){
                            questionList.forEach(function(questionReal){
                              //alert('questionList进来了');
                              if(_self.get('stopLoop')){
                                return;
                              }
                              var answermodel=questionReal.get('answermodel');
                              if(!answermodel.get('answer.content')){
                                _self.set('saveInfo',false);//禁止保存
                                useModel.set('errorClass',true);//标红字体
                                _self.set("modelID", useModel.get('id'));
                                _self.set("model", useModel);
                                _self.send('selectModel',useModel);
                                _self.set('stopLoop',true);
                                return;
                              }else {
                                useModel.set('errorClass',false);
                                useModel.set('hasShow',false);
                                _self.set('saveInfo',true);
                              }
                            });
                          }else {
                            _self.set('saveInfo',false);//禁止保存
                            console.log('saveInfo1',_self.get('saveInfo'));
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
                        return;
                      }
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                       evaModel.save().then(function() {
                            _self.get('allresultList').forEach(function(result) {
                                result.set('customer', _self.get('evaModel.customer'));
                                //计算分数
                                var scores = null;
                                result.get('answers').forEach(function(answer) {
                                    var realAnswer = answer.get('answer');
                                    var score = realAnswer.get('score');
                                    scores += score;
                                });
                                result.set('score', scores);
                                //计算护理等级
                                _self.get('store').query('evaluatescorescope',{filter:{
                                  'maxScore@$gte': scores,
                                  'minScore@$lte': scores,
                                  '[model][id]':result.get('model.id')
                                },
                              }).then(function(scopeList){
                                  result.set('level',scopeList.get('firstObject.level'));
                                  if(!_self.get('saveResult')){
                                    App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                    _self.didInsertElement();
                                    if (_self.get('addMode')) {
                                        mainpageController.switchMainPage('eva-question', {});
                                    }
                                    _self.set('detailModify', false);
                                    return;
                                  }
                                  result.save().then(function() {
                                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                      _self.didInsertElement();
                                      if (_self.get('addMode')) {
                                          mainpageController.switchMainPage('eva-question', {});
                                      }
                                      _self.set('detailModify', false);
                                  });
                                });

                            });
                        });
                    } else {
                        evaModel.set("validFlag", Math.random());
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
                mainpageController.switchMainPage('eva-question', {
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
                    mainpageController.switchMainPage('eva-question');
                });
            });
        },
        changeCreateDateAction(date) {
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

            } else { //添加
                let modelName = model.get('title');
                if (model.get('selectList')) { //如果是之前点击的模板,则从对象selectQuestionObj里面找到
                    var selectQuestionObj = this.get('selectQuestionObj');
                    var questionList = selectQuestionObj[modelName];
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
                this.doQuery();
                //批存(answersList)
            }

        },
        chooseAnswer(answer, question) {
            if (this.get("detailModify")) {
                this.set('saveInfo',true);//禁止保存标识
                var curAnswerId = answer.get("id");
                question.set("curAnswerId", curAnswerId);
                this.set('saveResult',true);//标识是否要保存result(编辑的时候重新勾选答案的话不需要循环allresultList去保存)
            }
        },
    }
});
