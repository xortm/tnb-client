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
  customerId: null,
  /*控制相关属性*/
  recognizers:"tap pan",
  showMode: "normal",//显示模式 正常：normal 展开：expand 显示功能按钮：showFunc
  /*显示相关属性*/
  constants:Constants,

  actions:{
    //跳转到detail页面
    gotoCustomerList(){
      console.log("go customer warning detail");
      var _self = this;
      var params = {};
      params= {customerId:_self.get("customerItem.customerId"),itemIdFlag:Math.random()};
      console.log("gotoCustomerList params",params);
      var customerId = "customerItem_" + this.get("customerItem.customerId");
      $("#" + customerId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + customerId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("customerItem in list:",_self.get("customerItem"));
          _self.get("feedBus").set("customerItemData",_self.get("customerItem"));
          mainpageController.switchMainPage('score-question-customer',params);
        },100);
      },200);
    },

  }

});
