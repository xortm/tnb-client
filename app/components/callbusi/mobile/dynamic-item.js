import Ember from 'ember';
import BaseUiItem from '../../ui/base-ui-item';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default BaseUiItem.extend(GesturesMixin,{
  /*控制相关属性*/
  recognizers: 'press tap',//移动端手势
  constants:Constants,
  showDelButFlag:false,
  clickOfShowDelButFlag:true,

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

  mobileAlertMess: function(text) {
    var _self = this;
    this.set('responseInfo',text);
    this.set('showDelButFlag',true);
    setTimeout(()=>{
      _self.set("showDelButFlag", false);
    },3000);
  },

  actions:{
    //跳转到detail页面
    delItemAction(dynamicId){
      // this.set("showDelButFlag", false);
      this.sendAction("delItemAction", dynamicId);
    },

    showDelBut(){
      if(!this.get("clickOfShowDelButFlag")){
        return;
      }
      // this.set("showDelButFlag", true);
      this.mobileAlertMess('删除');
    },
    hideDelBut(){
      this.set("showDelButFlag", false);
      // this.mobileAlertMess('删除');
    },


  }

});
