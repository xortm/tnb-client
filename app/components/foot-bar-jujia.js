import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  global_curStatus: Ember.inject.service("current-status"),
  service_PageConstrut: Ember.inject.service('page-constructure'),
  recognizers: 'tap press',//移动端手势
  menus: null,//菜单数据,外部传入

  menuObs: function() {
    if(!this.get("menus")||this.get("menus.length")===0){
      return;
    }
    console.log("menuObs len:" + this.get("menus.length"));
    //默认进入任务列表
    var isConsumer = this.get("global_curStatus").isConsumer;
    var menuItem = Ember.Object.create({});
    if (isConsumer) {
      console.log("11111111111111 code publicnumber-service");
      menuItem.set("code","jujia-my");
    }else {
      console.log("11111111111111 code task-square");
      menuItem.set("code","task-square");
    }
    this.send("menuClick",menuItem);
  }.observes("menus").on("init"),

  actions:{
    menuClick(menu){
      document.documentElement.style.overflow = "scroll";//每次都会返回顶部。
      var _self = this;
      console.log("menuitem in",menu);
      if(this.get("menus")){
        this.get("menus").forEach(function(menuItem){
          if(menuItem.get("selected")){
            //记录原菜单页面
            _self.set("oriMenuCode",menuItem.get("code"));
          }
          menuItem.set("selected",null);
          console.log("menuItem code:" + menuItem.get("code") + "|and menu code:" + menu.get("code"));
          //如果一致，则改变
          if(menuItem.get("code")===menu.get("code")){
            menuItem.set("selected","selected");
          }
        });
      }
    },
    menuChange(menu){
      if(menu.get("selected")){
        //触发页面跳转
        console.log("need send action,oriMenuCode:" + this.get("oriMenuCode"));
        this.sendAction("changeMainPage",menu.get("code"));
      }
    }
  }
});
