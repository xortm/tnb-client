import Ember from 'ember';
import CommonButton from '../common-button';

export default CommonButton.extend({
  tagName: "div",
  classStatic: true,
  classNameBindings: ['classStatic:tab-item','itemXs','selected:selected'],
  // itemXs:Ember.computed("colNumber",function(){
  //   var prefix = "col-xs-";
  //   var i = 12/this.get("colNumber");
  //   return prefix + i;
  // }),
  // itemXs:Ember.computed("colNumber",function(){
  //   var prefix = "width";
  //   var i = parseInt(100/this.get("colNumber"));
  //   return  prefix + i + 'B';
  // }),
  menu: null,
  selected: false,
  touchStart: function(){
    this._super();
    // this.set("selected",true);
  },
  didRender() {
      console.log("didRender in iner tab,menu:",this.get("menu.code") + " and selected:" + this.get("selected"));
      this._super(...arguments);
      if (this.get('renderAction')&&this.get("selected")) {
        var renderAction = this.get('renderAction');
        console.log("renderAction iner tab:" + renderAction);
        var _self = this;
        Ember.run.next(this,function() {
          _self.sendAction(renderAction,_self.clickActParams);
        });
      }
  },
  actions:{
    // touchStartAction: function(){
    //
    // },
    // clickAction: function(){
    //
    // }
  }
});
