import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  uiCapa: Ember.inject.service("ui-capability"),
  classStatic: true,
  isHide:true,
  classNameBindings: ['classStatic:line-item-task','isExpand:expand','outerClass'],
  outerClass:"",
  /*标记*/
  name: Ember.computed("item.itemId",function(){
    return "elti_" + this.get("item.itemId");
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
  constants:Constants,

  actions:{
    //跳转到detail页面
    gotoDetail(){
      console.log("go customer warning detail");
      var _self = this;
      var params = {};
      params= {itemId:_self.get("item.id"),itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      var itemId = "item_" + this.get("item.id");
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("item in list:",_self.get("item"));
          _self.get("feedBus").set("serviceData",_self.get("item"));
          mainpageController.switchMainPage('customer-warning-detail',params);
        },100);
      },200);
    },

  }

});
