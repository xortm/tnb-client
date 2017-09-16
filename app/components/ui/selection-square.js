import Ember from 'ember';
import BaseItem from './base-ui-item';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

/*
 * 选择按键组件
 * create by lmx
 */
export default Ember.Component.extend(GesturesMixin,{
  recognizers: 'tap',
  classStatic: true,
  hasSelected: false,
  text: null,//对应文字

  actions:{
    tapAction(){
      console.log("tap in,text:"+this.get("text") + " and hasSelected:" + this.get("hasSelected"));
      // if(this.get("hasSelected")){
      //   this.set("hasSelected",false);
      // }else{
      //   this.set("hasSelected",true);
      // }
      // console.log("hasSelected:" + this.get("hasSelected"),this.get('code'));
      this.sendAction("itemSelect",this.get("code"));
    },
    pressAction(){
      console.log("press in");
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('task-count-detail');
    }
  }

});
