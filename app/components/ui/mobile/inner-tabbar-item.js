import Ember from 'ember';
import CommonButton from '../common-button';

export default CommonButton.extend({
  tagName: "div",
  classStatic: true,
  classNameBindings: ['classStatic:tab-item','itemXs','selected:selected'],
  notRenderInFirst: true,
  menu: null,
  selected: false,
  touchStart: function(){
    this._super();
    // this.set("selected",true);
  },
  didInsertElement(){
    console.log("tab bar insert");
    this.set("insertFlag",true);
  },
  didRender() {
      console.log("didRender in iner tab,menu:",this.get("menu.code") + " and selected:" + this.get("selected"));
      this._super(...arguments);
      //第一次进入时，不进行模拟点击
      if(this.get("notRenderInFirst")&&this.get("insertFlag")){
        this.set("insertFlag",false);
        return;
      }
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
