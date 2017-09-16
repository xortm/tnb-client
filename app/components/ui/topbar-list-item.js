import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "li",
  classNameBindings: ['isActive'],
  itemData:null,//对应的数据
  funcDef: null,//功能按钮定义
  isActive:  Ember.computed(function () {
    return false;
  }),
  showPopMenu: false,
  actions: {
    doSelect: function(){
      console.log("doSelect in,this.itemData",this.itemData);
      this.sendAction('selectAction', this.itemData);
    },
    unSelect: function(){
      // this.set("showPopMenu",false);
    },
    //功能按钮点击动作
    funcClickAction: function(){
      console.log("funcClickAction in,this.itemData:" , this.itemData);
      this.funcDef.clickAction(this.itemData);
    },
  }
});
