import Ember from 'ember';
import BaseItem from './base-ui-item';

/*
 * 选择按键组件
 * create by lmx
 */
export default Ember.Component.extend({
  classStatic: true,
  text: null,//对应文字

  actions:{
    clickAction(){
      this.sendAction("itemSelect",this.get("code"));
    },
  }

});
