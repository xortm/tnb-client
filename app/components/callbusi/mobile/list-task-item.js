import Ember from 'ember';
import ListItem from '../../ui/mobile/list-item';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend(ListItem,{
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  uiCapa: Ember.inject.service("ui-capability"),
  constants:Constants,
  classStatic: true,
  isHide:true,
  classNameBindings: ['classStatic:line-item-task','isExpand:expand','outerClass'],
  outerClass:"",
  /*标记*/
  name: Ember.computed("item.itemId","infiniteContainerName",function(){
    console.log("infiniteContainerName:",this.get("infiniteContainerName"));
    return this.get("infiniteContainerName") + "_elti_" + this.get("item.itemId");
  }),
  itemId: null,
  dataType: "task",//数据模式，user：按用户显示 task：按任务显示
  /*控制相关属性*/
  recognizers:"tap pan",
  showMode: "normal",//显示模式 正常：normal 展开：expand 显示功能按钮：showFunc
  /*显示相关属性*/
  icon:null,
  content:null,
  title:null,
  label:null,

  isExpand:Ember.computed("showMode",function(){
    if(this.get("showMode")==="expand"){
      return true;
    }
    return false;
  }),
  didInsertElement: function(){
    if(this.get("item.hasApply")){
      this.set("disabled",true);
      this.set("dragble",true);
    }
    this._super();
    // let contentWidth = 200;
    // console.log("backTranspage:" + this.get("feedBus").get("backTranspage"));
    // //动态计算content部分宽度,只有前台转场才设置
    // var winW = document.documentElement.clientWidth|| document.body.clientWidth;
    // Ember.$(".col-xs-middle-task").width(winW);
    // var maxW = winW + 172;
    // Ember.$(".contentArea").width(maxW);
    // if(!this.get("feedBus").get("backTranspage")||this.get("feedBus").get("backTranspage")!=="task-square"){
    //   let totalWidth = Ember.$(".col-xs-middle-task").width();
    //   let titleWidth = Ember.$(".col-xs-middle-task .title").width();
    //   contentWidth = totalWidth - titleWidth -10;
    //   console.log("totalWidth:" + totalWidth + " and titleWidth:" + titleWidth);
    //   this.set("contentWidth",contentWidth);
    //   Ember.$(".col-xs-middle-task .content").width(contentWidth);
    // }
    //渲染完毕的标志
    // this.set("hasInsertElement",true);
  },
  didRender:function(){
    var winW = document.documentElement.clientWidth|| document.body.clientWidth;
    Ember.$(".col-xs-middle-task").width(winW);
    var maxW = winW + 172;
    Ember.$(".contentArea").width(maxW);
  },

  actions:{
    tapAct(event){
      if(this.getScrollFlag()){
        console.log("tapAct need prevent");
        return;
      }
      this.send("gotoDetail");
    },
    panMoveProcAction(e){
      //切换成按钮显示方式
      this.set("showMode","showFunc");
    },
    expandDetail(){
      this.set("showMode","expand");
    },
    hideDetail(){
      this.set("showMode","normal");
    },
    gotoDetail(){
      console.log("go task detail");
      console.log("item itemId in list:",this.get("item.itemId"));
      console.log("item in list:",this.get("item"));
      var _self = this;
      var itemId = "item_" + this.get("item.itemId");
      var itemIdshow = "item_" + this.get("item.busiId")+"_"+this.get("item.itemId");
      var scrollFlagDomId = this.get("scrollFlagDomId");
      console.log("scrollFlagDomId itemIdshow ",scrollFlagDomId,itemIdshow);
      var params = {};
      if(scrollFlagDomId=="serviceCareContainer-time"){
        params= {itemId:_self.get("item.itemId"),flag:"care",taskFlag:'timed',itemIdFlag:Math.random()};
      }else if(scrollFlagDomId=="serviceNurseContainer-time"){
        params= {itemId:_self.get("item.itemId"),flag:"nurse",taskFlag:'timed',itemIdFlag:Math.random()};
      }
      console.log("scrollFlagDomId params",params);
      $("#" + itemIdshow).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemIdshow).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          _self.get("feedBus").set("threadData",_self.get("item"));
          console.log("run in switch"+params.itemIdFlag);
          mainpageController.switchMainPage('task-detail',params);
        },100);
      },200);
    },
    finish(){
      console.log("finish in",this.get("item"));
      //复位
      this.reset();
      // var saveFlag = this.get("saveFlag");
      // if(saveFlag){return;}//网络问题会导致保存按钮不触发 一直点击重复保存所以set 一个flag
      // this.set("saveFlag",true);
      this.sendAction("finish",this.get("item"));

    }
  }

});
