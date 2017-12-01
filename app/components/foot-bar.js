import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  global_curStatus: Ember.inject.service("current-status"),
  service_PageConstrut: Ember.inject.service('page-constructure'),
  recognizers: 'tap press',//移动端手势
  menus: null,//菜单数据,外部传入
  //判断是否是function-page页面
  showHeaderAndFooter:Ember.computed('service_PageConstrut.curRouteName',function(){
    var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
    if(curRoutePath==="function-page"){
      return false;
    }
    return true;
  }),

  menuObs: function() {
    if(!this.get("menus")||this.get("menus.length")===0){
      return;
    }
    console.log("menuObs len:" + this.get("menus.length"));
    //默认点击第一个菜单
    let homePage = localStorage.getItem(Constants.uickey_homePage);
    console.log("homePage in buss:",homePage);
    if(!homePage){
      let menuItem = this.get("menus.firstObject");
      this.send("menuClick",menuItem);
    }else{
      let menuItem = this.get("menus").findBy("code",homePage);
      this.send("menuClick",menuItem);
    }
  }.observes("menus").on("init"),

  actions:{
    menuClick(menu){
      document.documentElement.style.overflow = "scroll";//每次都会返回顶部。
      // var scroll = this.get("_scroller");
      // scroll.scrollTo(0, 0, 100);
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
    menuChange(menu,menuCode){
      console.log("menuChange in,menu:"+ menu.get("code") + " and menuCode:" + menuCode);
      if(!menuCode){
        menuCode = menu.get("code");
      }
      let preventMenuChange = this.get("global_curStatus.preventMenuChange");
      if(menu.get("selected")){
        //触发页面跳转
        console.log("need send action,oriMenuCode:" + this.get("oriMenuCode"));
        if(!preventMenuChange){
          this.sendAction("changeMainPage",menuCode);
        }else{
          this.set("global_curStatus.preventMenuChange",false);
        }
      }
    },
  }
});
