import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedBus: Ember.inject.service("feed-bus"),
  dataLoader: Ember.inject.service("data-loader"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"fullSelectContainer",
  scrollPrevent:true,

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
      return resultsItem;
    }
    return null;
  }),

  actions:{
    choose:function(maxScore){
      let itemId = "choose_" + maxScore;
      let _self = this;
      let resultsItem = this.get("resultsItem");
      let resultsItemScore = resultsItem.get("score");
      console.log("resultsItem",resultsItem);
      resultsItem.set("score",maxScore);
      $("#"+itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage("employee-assessment-detail");
          resultsItem.save().then(function(){
            App.lookup("controller:business").popTorMsg(_self.get("name")+"分数修改完成!");
            _self.get("feedBus").set("assessmentFlag",true);
          }, function(err) {
            console.log("save err!");
            console.log("err:",err);
            resultsItem.set("score",resultsItemScore);
            App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
            // let error = err.errors[0];
            // if (error.code === "99") {
            // }
          });
        },100);
      },200);
    },

    switchShowAction(){
      this.directInitScoll(true);
    },

  },
  // typeList.each(function(item){
  //   let hasItem = list.findBy("assessmentIndicator_id",item.id);
  //   if(!hasItem){
  //     hasItem = store.createRecord();
  //     hasItem.set("assessmentIndicator",item);
  //     list.pushObject("hasItem");
  //   }
  // })
  // list.each();

});
