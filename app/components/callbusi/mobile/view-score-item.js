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
    return "score_" + this.get("item.itemId");
  }),
  itemId: null,
  /*控制相关属性*/
  recognizers:"tap pan",
  /*显示相关属性*/
  constants:Constants,

  actions:{
    //跳转到detail页面
    gotoDetail(){
      console.log("go customer warning detail");
      var _self = this;
      var params = {};
      params= {itemId:_self.get("item.id")};
      console.log("gotoDetail params",params);
      var itemId = "scoreItem_" + this.get("item.id");
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("item in list:",_self.get("item"));
          // _self.get("feedBus").set("serviceData",_self.get("item"));
          mainpageController.switchMainPage('view-score-detail',params);
        },100);
      },200);
    },

  }

});
