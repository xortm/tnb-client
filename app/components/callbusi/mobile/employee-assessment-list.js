import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import GesturesMixin from 'ember-gestures/mixins/recognizers';
export default BaseUiItem.extend(GesturesMixin,{
  store: Ember.inject.service("store"),
  feedBus: Ember.inject.service("feed-bus"),
  uiCapa: Ember.inject.service("ui-capability"),
  classStatic: true,
  isHide:true,
  classNameBindings: ['classStatic:line-item-task','outerClass'],
  outerClass:"",
  recognizers: 'press tap',//移动端手势
  /*标记*/
  name: Ember.computed("item.itemId",function(){
    return "elti_" + this.get("item.itemId");
  }),
  itemId: null,
  /*控制相关属性*/
  showMode: "normal",//显示模式 正常：normal 展开：expand 显示功能按钮：showFunc
  constants:Constants,
  press(e) {
   e=e||window.event;
   if (e.stopPropagation) {
     e.stopPropagation();//IE以外
   } else {
     e.cancelBubble = true;//IE
   }
   console.log("press in",e);
   var target = e.target || e.srcElement;
  },

  tap(e) {
   console.log("tap in",e);
  },
  actions:{
    //删除遮罩
    showDelBut(){
      this.set('showDelButFlag',true);
      console.log('come in showDelBut');
    },
    hideDelBut(){
      this.set('showDelButFlag',false);
    },
    delItemAction(item){
      let _self = this;
      item.set('delStatus',1);
      item.save().then(function(){
        _self.set('showDelButFlag',false);
        App.lookup("controller:business").popTorMsg("删除成功");
        _self.sendAction('delAction');
      });
    },
    //跳转到detail页面
    gotoDetail(){
      var _self = this;
      var params = {};
      params= {itemId:_self.get("item.id"),source:"look",itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      var itemId = "assessment_" + this.get("item.id");
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("item in list:",_self.get("item"));
          _self.get("feedBus").set("assessmentData",_self.get("item"));
          mainpageController.switchMainPage('employee-assessment-detail',params);
        },100);
      },200);
    },

  }

});
