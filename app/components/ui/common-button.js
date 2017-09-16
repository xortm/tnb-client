import Ember from 'ember';
import BaseItem from './base-ui-item';

export default BaseItem.extend({
  global_curStatus: Ember.inject.service("current-status"),
  attributeBindings: ["name"],
  clickActParams:null,
  needDoubleClickPrevent: false,//屏蔽重复点击
  disabled: false,
  click() {
    var _self = this;
    if (this.get('clickAction')) {
      if(this.get("disabled")){
        return;
      }
      var clickAction = this.get('clickAction');
      console.log("clickAction:" + clickAction);
      //屏蔽重复点击
      if(_self.get("needDoubleClickPrevent")){
        console.log("preventRepeatSubmitFlag in touchStart:",_self.get("global_curStatus.preventRepeatSubmitFlag"));
        if(_self.get("global_curStatus.preventRepeatSubmitFlag")){
          console.log("touchStartAction in touchStart:",_self.get("global_curStatus.preventRepeatSubmitFlag"));
          _self.sendAction(clickAction,this.clickActParams);
          _self.get("global_curStatus").set("preventRepeatSubmitFlag",false);
        }else{
          App.lookup('controller:business.mainpage').showPopTip("正在处理,请不要重复点击", false);
        }
      }else{
        _self.sendAction(clickAction,this.clickActParams);
      }
      //屏蔽重复点击
      // if(this.get("needDoubleClickPrevent")){
      //   this.set("disabled",true);
      // }
      // //3秒后还原
      // if(this.get("needDoubleClickPrevent")){
      //   Ember.run.later(function(){
      //     if(!_self){
      //       return;
      //     }
      //     _self.set("disabled",false);
      //   },3000);
      // }
    }
  },
  //移动端点击事件
  touchStart() {
    var _self = this;
    console.log("touchStart in");
    if(this.get("disabled")){
      return;
    }
    if (this.get('touchStartAction')) {
      var touchStartAction = this.get('touchStartAction');
      console.log("touchStartAction:" + touchStartAction + " with name:" + this.get("name"));
      //屏蔽重复点击
      if(_self.get("needDoubleClickPrevent")){
        console.log("preventRepeatSubmitFlag in touchStart:",_self.get("global_curStatus.preventRepeatSubmitFlag"));
        if(_self.get("global_curStatus.preventRepeatSubmitFlag")){
          console.log("touchStartAction in touchStart:",_self.get("global_curStatus.preventRepeatSubmitFlag"));
          _self.sendAction(touchStartAction,this.clickActParams);
          _self.get("global_curStatus").set("preventRepeatSubmitFlag",false);
        }else{
          App.lookup("controller:business").popTorMsg("您的操作过于频繁,请稍后");
        }
      }else{
        _self.sendAction(touchStartAction,this.clickActParams);
      }
      //屏蔽重复点击
      // if(this.get("needDoubleClickPrevent")){
      //   this.set("disabled",true);
      //   console.log("disabled in button true!");
      // }
      // //3秒后还原
      // if(this.get("needDoubleClickPrevent")){
      //   Ember.run.later(function(){
      //     if(!_self){
      //       return;
      //     }
      //     _self.set("disabled",false);
      //     console.log("disabled in button false!");
      //   },500);
      // }

    }
  },

  /*dom元素事件定义*/
  // didRender() {
  //     console.log("didRender in");
  //     if (this.get('renderAction')) {
  //       var renderAction = this.get('renderAction');
  //       console.log("renderAction:" + renderAction);
  //       this.sendAction(renderAction,this.clickActParams);
  //     }
  // },
});
