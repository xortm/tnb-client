import Ember from 'ember';
import CommonButton from '../common-button';

export default CommonButton.extend({
  tagName: "div",
  classNameBindings: ['outerClass'],
  touchStart: function(){
    this._super();
    // this.set("selected",true);
  },
});
