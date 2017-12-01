import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';

export default BaseUiItem.extend({
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  /*控制相关属性*/
  recognizers:"tap pan",
  showMode: "normal",//显示模式 正常：normal 展开：expand 显示功能按钮：showFunc
  /*显示相关属性*/
  constants:Constants,

  actions:{
    //跳转到detail页面
    gotoDetail(){
      console.log("go customer warning detail");
      var _self = this;
      let isConsumer = this.get("isConsumer");
      var params = {};
      params= {itemId:_self.get("item.id"),itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      var itemId = "itemLook_" + this.get("item.id");
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("item in list:",_self.get("item"));
          _self.get("feedBus").set("serviceOrderLookData",_self.get("item"));
          if(isConsumer){
            mainpageController.switchMainPage('service-order-detail',params);
          }else{
            mainpageController.switchMainPage('service-order-dispatch',params);
          }
        },100);
      },200);
    },

  }

});
