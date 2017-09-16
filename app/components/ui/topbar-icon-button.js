import Ember from 'ember';
import IconButton from './icon-button';

/*
 *  顶部功能按钮--PC端
 */
export default IconButton.extend({
  tagName: "li",
  popContent: true,
  classNameBindings: ['dropdown','hoverLine:hover-line'],
  attributeBindings: ['name'],
  tipNumber: null,//数字提示

  tipNumberShow:  Ember.computed("tipNumber",function () {
    if(this.get("tipNumber")&&this.get("tipNumber")>0){
      return true;
    }
    return false;
  }),
  dropdown:  Ember.computed(function () {
    return true;
  }),
  hoverLine:  Ember.computed(function () {
    return true;
  }),
  didInsertElement(){
    console.log("didInsertElement in");
  },
  //重载点击方法
  click() {
    // this.toggleProperty("popContent");
  },
});
