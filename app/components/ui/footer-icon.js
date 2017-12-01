import Ember from 'ember';
import CommonButton from './common-button';

export default CommonButton.extend({
  global_curStatus: Ember.inject.service("current-status"),
  tagName: "div",
  classStatic: true,
  needDoubleClickPrevent: false,
  classNameBindings: ['classStatic:footer-nav','classStatic:col-xs-3','selected:selected','isDisabled:isDisabled'],
  menu: null,
  selected: false,
  touchStart: function(){
    let isDisabled = this.get("isDisabled");
    if(isDisabled){
      return false;
    }
    // }else{
    //   this._super();
    // }
    this._super();
    // this.set("selected",true);
  },
  isFourIcon:Ember.computed('global_curStatus.isConsumer','global_curStatus.isJujia',function(){
    var isConsumer = this.get('global_curStatus.isConsumer');
    var isJujia = this.get('global_curStatus.isJujia');
    if(isJujia){
      return true;
    }
    if(isConsumer){
      return false;
    }
    return true;
  }),
  isThreeIcon:Ember.computed('global_curStatus.isConsumer','global_curStatus.isJujia',function(){
    var isConsumer = this.get('global_curStatus.isConsumer');
    var isJujia = this.get('global_curStatus.isJujia');
    if(isJujia){
      return false;
    }
    if(isConsumer){
      return true;
    }
    return false;
  }),
  isDisabled:Ember.computed('menu',function(){
    var menu = this.get('menu.code');
    console.log("menu in isDisabled:",menu);
    if(menu === "connect-manage" || menu === "service-query" || menu === "other-business"){
      return true;
    }
    return false;
  }),
  didRender() {
    console.log("didRender in,menu:" + this.get("menu.code") + " and selected:" + this.get("selected"));
    this._super(...arguments);
    if (this.get('renderAction')&&this.get("selected")) {
      var renderAction = this.get('renderAction');
      console.log("renderAction is:" + renderAction);
      var _self = this;
      setTimeout(()=>{
        console.log("_self.clickActParams is",_self.clickActParams);
        _self.sendAction(renderAction,_self.clickActParams);
      },50);
      // Ember.run.next(this,function() {
      //   console.log("_self.clickActParams",_self.clickActParams);
      //   _self.sendAction(renderAction,_self.clickActParams);
      // });
    }
  },
});
