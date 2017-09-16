/*--
创建人:薛立想
创建时间:2017-08-30
定时任务与不定时任务用不同的jrol组件
 --*/
import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import InfiniteScroll from '../../../controllers/infinite-scroll';

export default BaseUiItem.extend(InfiniteScroll,{
  store: Ember.inject.service("store"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  feedBus: Ember.inject.service("feed-bus"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  global_curStatus: Ember.inject.service("current-status"),
  constants: Constants,
  i: 0,
  scrollToPosition: false,//刷新后使滚动
  // infiniteContentPropertyName: Ember.computed(function(){
  //   return this.get("infiniteContentPropertyName");
  // }),
  //动态计算当前infiniteContainerName
  infiniteContainerName: Ember.computed("infiniteName",function(){
    let infiniteContainerName = this.get("infiniteName") + "-time";
    console.log("infiniteContainerName time:",infiniteContainerName);
    return  infiniteContainerName;
  }),
  //下拉刷新,传递给上层
  queryFlagIn: function(){
    console.log("run in queryFlagIn time");
    this.sendAction("queryFlagInAction");
  },
  //根据时间节点的变化,滑动到相应id的位置
  selectStartTimeObs: function(){
    let _self = this;
    console.log("run in selectStartTimeObs");
    let scrollHasReady = this.get("scrollHasReady");
    console.log("scrollHasReady:",scrollHasReady);
    let selectStartTime = _self.get("selectStartTime");
    let selectEndTime = _self.get("selectEndTime");
    console.log("selectStartTime before:",selectStartTime);
    console.log("selectEndTime before:",selectEndTime);
    let _scroller = this.get("_scroller");
    //是否滑动到相应位置的标志
    let scrollToPosition = this.get("scrollToPosition");
    console.log("scrollToPosition brfore:" + this.get("scrollToPosition"));
    if(!_scroller||!selectStartTime||!selectEndTime||!scrollToPosition){return;}
    this.set("scrollToPosition",false);
    let scrollToPositionAfter = this.get("scrollToPosition");
    console.log("scrollToPosition after:"+ this.get("scrollToPosition"));
    console.log("scroller afterRender:",_scroller);
    console.log("selectStartTime afterRender:",selectStartTime);
    console.log("selectEndTime afterRender:",selectEndTime);
    Ember.run.schedule("afterRender",this,function() {
      let scrollFlagId = "#" + _self.get("infiniteContainerName") + "-scrollFlagId";
      let flagId = "#" + _self.get("infiniteContainerName") + "flag";
      let liClass = "." + _self.get("infiniteContainerName") + "-";
      let filterUlClass = "." + _self.get("infiniteContainerName") + "-filterUl";
      console.log("scrollFlagId in offset:",scrollFlagId);
      console.log("flagId in offset:",flagId);
      //得到顶部的位置
      var topNum = $(scrollFlagId).offset().top;
      console.log("topNum:",topNum);
      $(filterUlClass+ " li").each(function(){
        $(this).removeClass("color2FA7FDandBold");
      });
      let flagTop;
      //得到相应时间点的位置
      if(selectStartTime=="0"){
        $(liClass + "li0_6").addClass("color2FA7FDandBold");
        $(liClass + "li0_6").prev().addClass("color2FA7FDandBold");
        $(liClass + "li0_6").next().addClass("color2FA7FDandBold");
        if($(flagId+"0").length){
          flagTop = $(flagId+"0").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==6) {
        $(liClass + "li6_8").addClass("color2FA7FDandBold");
        $(liClass + "li6_8").prev().addClass("color2FA7FDandBold");
        $(liClass + "li6_8").next().addClass("color2FA7FDandBold");
        if($(flagId+"6").length){
          flagTop = $(flagId+"6").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==8) {
        $(liClass + "li8_10").addClass("color2FA7FDandBold");
        $(liClass + "li8_10").prev().addClass("color2FA7FDandBold");
        $(liClass + "li8_10").next().addClass("color2FA7FDandBold");
        if($(flagId+"8").length){
          flagTop = $(flagId+"8").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==10) {
        console.log("render ok");
        $(liClass + "li10_12").addClass("color2FA7FDandBold");
        $(liClass + "li10_12").prev().addClass("color2FA7FDandBold");
        $(liClass + "li10_12").next().addClass("color2FA7FDandBold");
        if($(flagId+"10").length){
          flagTop = $(flagId+"10").offset().top;
          console.log("flagTop in 10",flagTop);
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==12) {
        $(liClass + "li12_14").addClass("color2FA7FDandBold");
        $(liClass + "li12_14").prev().addClass("color2FA7FDandBold");
        $(liClass + "li12_14").next().addClass("color2FA7FDandBold");
        if($(flagId+"12").length){
          flagTop = $(flagId+"12").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==14) {
        $(liClass + "li14_16").addClass("color2FA7FDandBold");
        $(liClass + "li14_16").prev().addClass("color2FA7FDandBold");
        $(liClass + "li14_16").next().addClass("color2FA7FDandBold");
        if($(flagId+"14").length){
          flagTop = $(flagId+"14").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==16) {
        $(liClass + "li16_18").addClass("color2FA7FDandBold");
        $(liClass + "li16_18").prev().addClass("color2FA7FDandBold");
        $(liClass + "li16_18").next().addClass("color2FA7FDandBold");
        if($(flagId+"16").length){
          flagTop = $(flagId+"16").offset().top;
          console.log("flagTop in 16",flagTop);
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==18) {
        $(liClass + "li18_20").addClass("color2FA7FDandBold");
        $(liClass + "li18_20").prev().addClass("color2FA7FDandBold");
        $(liClass + "li18_20").next().addClass("color2FA7FDandBold");
        console.log("flagId18ID:",flagId+"18");
        if($(flagId+"18").length){
          flagTop = $(flagId+"18").offset().top;
          console.log("flagTop in 18",flagTop);
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime==20) {
        $(liClass + "li20_24").addClass("color2FA7FDandBold");
        $(liClass + "li20_24").prev().addClass("color2FA7FDandBold");
        $(liClass + "li20_24").next().addClass("color2FA7FDandBold");
        if($(flagId+"20").length){
          flagTop = $(flagId+"20").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("此时间段没有项目");
        }
      }else if (selectStartTime=="hasApply") {
        $(liClass + "li_hasApply").addClass("color2FA7FDandBold");
        if($(flagId+"HasApply").length){
          flagTop = $(flagId+"HasApply").offset().top;
        }else{
          // App.lookup("controller:business").popTorMsg("没有已完成项目");
        }
      }
      if(!flagTop){
        return;
      }
      console.log("flagTop:",flagTop);
      var scrollNum = topNum-flagTop;
      console.log("scrollNum:",scrollNum);
      // _self.set("scrollNum",scrollNum);
      //滚动的相应位置
      _scroller.scrollTo(0, scrollNum, 0);
      _self.set("scrollHasReady",false);
    });
  }.observes("selectStartTime","selectStartTime","selectStartTimeFlag","_scroller").on("init"),
//观察者:只刷新jroll,保证滚动的位置不变
  directInitScollFlagObs:function(){
    console.log("scollFlag in obs",this.get("scollFlag"));
    if(this.get("scollFlag") == "1"){return;}
    console.log("run scollFlag in directInitScollFlagObs time");
    this.set("scrollToPosition",false);
    this.refreshScrollerAction();
  }.observes("scollFlag"),


  actions:{
    //这个是判断 list是否在hbs加载完毕标示
    didInsertAct(code){
      var _self = this;
      var list = this.get("serviceList");
      var i = this.get("i");
      i++;
      this.set("i",i);
      console.log("didInsertAct el:" + code);
      if(i>=8){
        if(window.cordova){
          this.send("addItemMask",code);
        }
      }
      if(i >= list.get("length")){
        this.set("btnFlag",false);
        console.log("LoadingImgInss999");
        this.sendAction("showLoadingImgInClose");//关闭加载图片
        _self.hideAllLoading();
        this.set("i",0);
        console.log("rend over");
        //如果查找的是全部老人,则不回到顶部,且滚动到指定位置
        if(_self.get("showRightFlag")){
          this.set("scrollToPosition",false);//可控制第一次加载是否滚动到指定的时间段
          this.directInitScoll();
        }else{
          this.directInitScoll(true);
        }
        //定义viewport事件,如果是android
        if(window.cordova){
          inView('.list-task-item-class')
          .on('enter', el => {
            console.log("in viewport:" + $(el).attr("name"));
            _self.send("removeItemMask",$(el).attr("name"));
            _self.send("observesFlagId",$(el).children("div").attr("id"));
          })
          .on('exit', el => {
            console.log("exit viewport:" + $(el).attr("name"));
            _self.send("addItemMask",$(el).attr("name"));
          });
        }
      }
    },
    //观察id变化,右侧进行相应的处理
     observesFlagId(itemId){
       let _self = this;
       let flagId = this.get("infiniteContainerName") + "flag";
       let liClass = "." + _self.get("infiniteContainerName") + "-";
       let filterUlClass = "." + _self.get("infiniteContainerName") + "-filterUl";
       console.log("observesFlagId itemId:",itemId);
       if(itemId){
         console.log("itemId run in:",itemId);
         $(filterUlClass+ " li").each(function(){
           $(this).removeClass("color2FA7FDandBold");
         });
         if(itemId == flagId + "0"){
           $(liClass + "li0_6").addClass("color2FA7FDandBold");
           $(liClass + "li0_6").prev().addClass("color2FA7FDandBold");
           $(liClass + "li0_6").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "6"){
           $(liClass + "li6_8").addClass("color2FA7FDandBold");
           $(liClass + "li6_8").prev().addClass("color2FA7FDandBold");
           $(liClass + "li6_8").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "8"){
           $(liClass + "li8_10").addClass("color2FA7FDandBold");
           $(liClass + "li8_10").prev().addClass("color2FA7FDandBold");
           $(liClass + "li8_10").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "10"){
           console.log("render ok");
           $(liClass + "li10_12").addClass("color2FA7FDandBold");
           $(liClass + "li10_12").prev().addClass("color2FA7FDandBold");
           $(liClass + "li10_12").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "12"){
           $(liClass + "li12_14").addClass("color2FA7FDandBold");
           $(liClass + "li12_14").prev().addClass("color2FA7FDandBold");
           $(liClass + "li12_14").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "14"){
           $(liClass + "li14_16").addClass("color2FA7FDandBold");
           $(liClass + "li14_16").prev().addClass("color2FA7FDandBold");
           $(liClass + "li14_16").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "16"){
           $(liClass + "li16_18").addClass("color2FA7FDandBold");
           $(liClass + "li16_18").prev().addClass("color2FA7FDandBold");
           $(liClass + "li16_18").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "18"){
           $(liClass + "li18_20").addClass("color2FA7FDandBold");
           $(liClass + "li18_20").prev().addClass("color2FA7FDandBold");
           $(liClass + "li18_20").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "20"){
           $(liClass + "li20_24").addClass("color2FA7FDandBold");
           $(liClass + "li20_24").prev().addClass("color2FA7FDandBold");
           $(liClass + "li20_24").next().addClass("color2FA7FDandBold");
         }else if(itemId == flagId + "HasApply"){
           $(liClass + "li_hasApply").addClass("color2FA7FDandBold");
         }
       }
     },
    //添加单项的遮罩this.get("infiniteContainerName") +
     addItemMask(itemName){
       let el = $("div[name='" + itemName + "']");
      //  let mkName = 'elmk_' + itemName;
      //  el.find("div[name='" + mkName + "']").remove();
      //  let mkContent = "<div name='" + mkName + "' style='position:absolute;background:white;width:100%;height:100%;'>...</div>";
      //  el.append(mkContent);
       el.find("div[name='listContainer'] > div").hide();
     },
     //取消单项的遮罩
     removeItemMask(itemName){
       let el = $("div[name='" + itemName + "']");
      //  let mkName = 'elmk_' + itemName;
      //  el.find("div[name='" + mkName + "']").remove();
       el.find("div[name='listContainer'] > div").show();
     },
     //右侧点击完时间节点,做相应的操作
     queryTime(param1,param2){
       let flagId = "#" + this.get("infiniteContainerName") + "flag";
       if(param1 == "hasApply"){
         console.log("flagId in queryTime has:",flagId+"param1");
         if($(flagId+"HasApply").length){
           // App.lookup("controller:business").popTorMsg("查看已完成项目");
         }else{
           App.lookup("controller:business").popTorMsg("没有已完成项目");
           return;
         }
       }else{
         console.log("flagId in queryTime:",flagId+"param1");
         if($(flagId + param1).length){
           // App.lookup("controller:business").popTorMsg("正在定位");
         }else{
           App.lookup("controller:business").popTorMsg("此时间段没有项目");
           return;
         }
       }
       this.set("scrollToPosition",true);
       let scrollToPosition = this.get("scrollToPosition");
       console.log("scrollToPosition in queryTime:",scrollToPosition);
       this.set("selectStartTime",param1);
       this.set("selectEndTime",param2);
       this.incrementProperty("selectStartTimeFlag");
     },
     //左右滑动的处理
     panStartAction(){
       console.log("panStartAction in ts");
       //阻止滚动
       this.set("scrollPrevent",true);
     },
    panEndAction(){
      var _self = this;
      console.log("panEndAction in ts");
      //放开滚动,延时500毫秒
      Ember.run.later(function(){
        _self.set("scrollPrevent",false);
      },500);
    },
    finish(serviceItem){
      this.sendAction("finish",serviceItem);
    },

  },
});
