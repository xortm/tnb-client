import Ember from 'ember';
import BaseItem from './base-ui-item';

/*
 *  可选择区域，具备选择事件
 *
 *  创建人：梁慕学
 */
export default BaseItem.extend({
  classStatic: true,
  classNameBindings: ['selectedClass'],
  selectedClass:Ember.computed("selected",function(){
    if(this.get("selected")){
      return "selected-area";
    }
    return "";
  }),
  click:function(){
    this.set("selected",true);
    this.sendAction("selectAction",this.get("content"),this.get("busiType"));
  },
  actions:{
    commit(){
      this.set("selected",false);
      // this.sendAction("commitAction",this.get("content"),this.get("busiType"));
    },
    cancel(){
      this.set("selected",false);
    },
  }
});
