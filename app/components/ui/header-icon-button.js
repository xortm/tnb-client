import Ember from 'ember';
import IconButton from './icon-button';

/*
 *  头部功能按钮--移动端
 */
export default IconButton.extend({
  tagName: "div",
  mode: "click",
  className:["dropdown","hover-line"],
  attributeBindings: ['name'],
  didInsertElement: function(){
    console.log("didInsertElement in");
  },
});
