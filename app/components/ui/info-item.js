import Ember from 'ember';
/*
 * 用于个人信息，或其他信息（左右布局，图片+简介）
 */
export default Ember.Component.extend({
  tagName: "a",
  classNameBindings: ['isActive'],
  className:["dropdown","hover-line"],
  attributeBindings: ['title','data-toggle','data-placement','data-content','data-trigger','data-original-title'],

  isActive:  Ember.computed(function () {
    return false;
  }),
});
