import Ember from 'ember';

import CommonButton from './common-button';
export default CommonButton.extend({
  tagName: "div",
  classStatic: true,
  classNameBindings: ['classStatic:pointer'],
  attributeBindings: ['title','data-toggle',
    'data-placement','data-content','data-trigger','data-original-title'],
  iconClass:"",

  isShine:false,//图标是否闪烁
});
