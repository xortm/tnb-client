import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"scoreQuestionDetailContainer",
  preventInfinite: true,
  customerListFlag: 0,
  constants:Constants,

  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),

  scoreQusetionitem:Ember.computed("itemId","itemIdFlag",function(){
    //从全局上下文服务里拿到外层传递的数据
    this._showLoading();
    let scoreQusetionitem = this.get("feedBus").get("scoreQusetionData");
    console.log("scoreQusetionitem computed:",scoreQusetionitem);
    this.get("feedBus").set("serviceData",null);//重置feedbus数据
  //与传参进行比较，一致才设置
    if(scoreQusetionitem.get("employeeIdInloop")===this.get("itemId")){
      this.hideAllLoading();
      return scoreQusetionitem;
    }
  }),

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
    },
    tapItem(scroe,appraiseItemId){
      console.log("appraiseItemId in tap:",appraiseItemId);
      let appraiseResultItemList = this.get("scoreQusetionitem.items");
      let appraiseResultItem = appraiseResultItemList.findBy('item.id',appraiseItemId);
      console.log("appraiseResultItem in tap:",appraiseResultItem);
      appraiseResultItem.set('score',scroe+1);
    },
    saveAppraiseResult(){
      let _self = this;
      _self.set("hasNoContent",false);
      let appraiseResultItemList = this.get("scoreQusetionitem.items");
      appraiseResultItemList.forEach(function(appraiseResultItem){
        if(appraiseResultItem.get("score") === 0){
          _self.set("hasNoContent",true);
        }
      });
      if(_self.get("hasNoContent")){
        App.lookup("controller:business").popTorMsg("您还有未填写的项目");
        return;
      }
      let scoreQusetionitem = this.get('scoreQusetionitem');
      console.log("scoreQusetionitem before:",scoreQusetionitem);
      let sysTime = _self.get("global_dataLoader").getNowTime();
      let averageScore = 0;
      let averageScoreLength = 0;
      scoreQusetionitem.get("items").forEach(function(item){
        averageScore = averageScore + item.get("score");
        averageScoreLength++;
      });
      if(averageScoreLength){
        averageScore = averageScore/averageScoreLength;
        averageScore = averageScore.toFixed(1);
      }
      scoreQusetionitem.set("averageScore",averageScore);
      scoreQusetionitem.set("appraiseTime",sysTime);
      scoreQusetionitem.set("hasReady",true);
      console.log("scoreQusetionitem after:",scoreQusetionitem);
      let itemElement = "saveBut";
      $("." + itemElement).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemElement).removeClass("tapped");
        Ember.run.later(function(){
          scoreQusetionitem.save().then(function(){
            App.lookup("controller:business").popTorMsg("提交成功");
            _self.incrementProperty("queryFlagInFlag");
            _self.set("appraiseResultItemHasExist",true);
          },function(err){
            App.lookup("controller:business").popTorMsg("提交失败");
            // let error = err.errors[0];
            // if(error.code ==='8'){
            //   App.lookup("controller:business").popTorMsg("保存失败");
            // }
          });
        },100);
      },200);

    },

  }
});
