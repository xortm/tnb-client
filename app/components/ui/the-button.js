import Ember from 'ember';

import CommonButton from 'tiannianbao/components/ui/common-button';
export default CommonButton.extend({
  tagName: "a",
  classNameBindings: ['isUrgent'],
  attributeBindings: ['href','title','data-toggle','data-placement','data-content','data-trigger','data-original-title'],
  href: "javascript:void(0)",
  iconClass:"",
  isShine:false,//图标是否闪烁
  text:null,//按钮文本
});
