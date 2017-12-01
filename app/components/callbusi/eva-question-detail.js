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
    evaModelObs: function() {
        var model = this.get("evaluate");
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
    actions: {
        invalid() {},
        //修改
        detailModifyClick: function() {
            this.set('detailModify', true);
        },
        //保存按钮
        detailSaveClick(){
          let _self = this;
          let evaModel = this.get('evaModel');
          App.lookup('controller:business.mainpage').openPopTip("正在提交");
          evaModel.save().then(function(evaluate){
            console.log('save evaluate batch id ',evaluate.get('id'),evaluate);
            _self.set('detailModify', false);
            App.lookup('controller:business.mainpage').showPopTip("提交成功");
            if(_self.get('addMode')){
              var mainpageController = App.lookup('controller:business.mainpage');
              mainpageController.switchMainPage('eva-question');
            }else{
              var route=App.lookup('route:business.mainpage.eva-detail');
              route.refresh();//刷新页面
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
                console.log('batch model ',evaluate);
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
        selectModel(result) {
            var _self = this;
            let evaluate = this.get('evaluate');

            this.set("modelID", result.get('id'));
            this.set("model", result);
            if(result.get('hasShow')){
              return;
            }
            evaluate.get('results').forEach(function(result){
              result.set('hasShow',false);
            })
            result.set('hasShow', true); //显示答题标识

        },
        chooseAnswer(answer,question){
          if(answer.get('selectFlag')==1){
            answer.set('selectFlag',0);
          }else{
            answer.set('selectFlag',1);
          }
          if(answer.get('hasSelcted')){
            answer.set('hasSelcted',false);
          }else{
            //查询该问题的其他答案，全部置为未选
            question.get('answerList').forEach(function(answer){
              answer.set('hasSelcted',false);
              answer.set('selectFlag',0);
            });
            answer.set('selectFlag',1);
            answer.set('hasSelcted',true);
          }
          answer.save().then(function(){
          });
        },
        levelInfo(str){
          let info ;
          if(str == 'actionLevel'){
            this.set('actionLevelInfo',true);
            this.set('nursingLevelInfo',false);
          }else if (str == 'nursingLevel') {
            this.set('actionLevelInfo',false);
            this.set('nursingLevelInfo',true);
          }
          this.set('levelInfoModal',true);
        },
        invitation(){
          this.set('levelInfoModal',false);
        }
    }
});
