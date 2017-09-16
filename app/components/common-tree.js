import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['hasSub:has-sub'],
  msHover: true,
  isRoot: Ember.computed("node",function(){
    var level = this.get("node.level");
    if(level===1){
      return true;
    }
    return false;
  }),
  hasSub: Ember.computed("node",function(){
    console.log("node len in hasSub is" + this.get("node.children").length);
    var children = this.get("node.children");
    if(children&&children.length>0){
      return true;
    }
    return false;
  }),
  isExpended: false,

  actions:{
    clickMenu(menu){
      // console.log("click menu in,menuName:" + menu.get("code"));
      this.set('isExpanded', true);
      var businessController = App.lookup("controller:business");
      console.log("this menu:",menu);
      if(!menu.children||menu.children.length===0){
        //设置选中，直接操作dom
        $(".sidebar-menu li").removeClass("current");
        this.$().addClass("current");
        businessController.send("changeMainPage",menu.code);
      }
    }
  }

});
