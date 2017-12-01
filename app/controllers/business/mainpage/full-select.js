import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedBus: Ember.inject.service("feed-bus"),
  dataLoader: Ember.inject.service("data-loader"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"fullSelectContainer",
  scrollPrevent:true,
  constants:Constants,
  maxScoreArr:Ember.computed('maxScore',function(){
    let maxScore = this.get("maxScore");
    let maxScoreArr = new Array(maxScore);
    for (var i = 0; i < maxScore; i++) {
      maxScoreArr[i] = i+1;
    }
    return maxScoreArr;
  }),
  resultsItem:Ember.computed("assessmentIndicatorId",function(){
    //从全局上下文服务里拿到外层传递的数据
    let resultsItem = this.get("feedBus").get("assessmentResultData");
    console.log("fullSelectContainer computed:",resultsItem);
  //与传参进行比较，一致才设置
    if(resultsItem.get("assessmentIndicator.id")===this.get("assessmentIndicatorId")){
      console.log('resultsItem id ',resultsItem.get("assessmentIndicator.id"),this.get("assessmentIndicatorId"));
      return resultsItem;
    }
    return null;
  }),
  typeAndRemarkObs:function(){
    let strType = this.get('strType');
    if(strType=='remark'||strType=='assessmentType'){
      console.log('strType',strType);
      if(strType=='remark'){
        this.set('remarkType',true);
        this.set('assessmentType',false);
      }
      if(strType=='assessmentType'){
        this.set('assessmentType',true);
        this.set('remarkType',false);
      }
      this.set('typeAndRemark',true);
    }else{
      this.set('typeAndRemark',false);
    }
  }.observes('strType').on('init'),
  assessmentTypeList:Ember.computed(function(){
    let _self = this;
    let assessmentTypeList = _self.get("dataLoader").findDictList(Constants.assessmentType); //字典数组
    console.log("assessmentTypeList:",assessmentTypeList);
    return assessmentTypeList;
  }),
  assessmentInfoObs:function(){
    let assessmentId = this.get('assessmentId');
    if(assessmentId){
      let assessmentInfo = this.store.peekRecord('assessment',assessmentId);
      this.set('assessmentInfo',assessmentInfo);
    }
  }.observes('assessmentId').on('init'),
  actions:{
    choose:function(maxScore){
      let itemId = "choose_" + maxScore;
      let _self = this;
      let resultsItem = this.get("resultsItem");
      // let resultsItemScore = resultsItem.get("score");
      console.log("resultsItem",resultsItem);
      resultsItem.set("score",maxScore);
      $("#"+itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          App.lookup('controller:business.mainpage').showMobileLoading();
          var mainController = App.lookup("controller:business.mainpage");
          resultsItem.save().then(function(){
            App.lookup("controller:business").popTorMsg(_self.get("name")+"分数修改完成!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
            _self.get("feedBus").set("assessmentFlag",true);
            mainController.switchMainPage("employee-assessment-detail");
          }, function(err) {
            console.log("save err!");
            console.log("err:",err);
            // resultsItem.set("score",resultsItemScore);
            App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
          });
        },100);
      },200);
    },
    chooseType(assessmentType,index){
      let assessment = this.store.peekRecord('assessment',this.get('assessmentId'));
      assessment.set('type',assessmentType);
      let _self = this;
      let itemId = "#choose-type-" + index;
      $(itemId).addClass("tapped");
      Ember.run.later(function(){
        $(itemId).removeClass("tapped");
        Ember.run.later(function(){
          App.lookup('controller:business.mainpage').showMobileLoading();
          var mainController = App.lookup("controller:business.mainpage");
          assessment.save().then(function(){
            App.lookup("controller:business").popTorMsg("考核类型修改完成!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
            _self.get("feedBus").set("assessmentFlag",true);
            mainController.switchMainPage("employee-assessment-detail");
          }, function(err) {
            console.log("save err!");
            console.log("err:",err);
            App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
          });
        },100);
      },200);
    },
    saveDetail(){
      let assessment = this.get('assessmentInfo');
      let _self = this;
      let itemId = ".assessment-button";
      $(itemId).addClass("tapped");
      Ember.run.later(function(){
        $(itemId).removeClass("tapped");
        Ember.run.later(function(){
          App.lookup('controller:business.mainpage').showMobileLoading();
          var mainController = App.lookup("controller:business.mainpage");
          assessment.save().then(function(){
            App.lookup("controller:business").popTorMsg("备注修改完成!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
            _self.get("feedBus").set("assessmentFlag",true);
            mainController.switchMainPage("employee-assessment-detail");
          }, function(err) {
            App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
          });
        },100);
      },200);
    },
    switchShowAction(){
      this.directInitScoll(true);
    },
    switchBackAction(){
      if(this.get("remarkType")){
        this.get("assessmentInfo").rollbackAttributes();
      }
    },

  },

});
