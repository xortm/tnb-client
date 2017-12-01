import Ember from 'ember';
import GesturesMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(GesturesMixin,{
  service_PageConstrut: Ember.inject.service('page-constructure'),
  dataLoader: Ember.inject.service("data-loader"),
  recognizers: 'tap press',//移动端手势
  menus: null,//菜单数据,外部传入
  refreshFlag: 0,

  didInsertElement() {
    this._super(...arguments);
    console.log("inner tab didInsertElement");
    let menus = this.get("menus");
    console.log("menus in did:",menus);
    let menusLength = menus.get("length");
    let innerClass = null;
    if(menusLength == 2){
      innerClass = "col-xs-6";
    }else if(menusLength == 3){
      innerClass = "col-xs-4";
    }else if(menusLength == 4){
      innerClass = "col-xs-3";
    }else if(menusLength == 5){
      innerClass = "width20B";
    }
    this.set("innerClass",innerClass);
  },

  actions:{
    menuClick(menu){
      var _self = this;
      console.log("menuitem in tab",menu);
      let menus = this.get("menus");
      menus.forEach(function(menuItem){
        if(menuItem.get("select")){
          //记录原菜单页面
          _self.set("oriMenuCode",menuItem.get("typecode"));
        }
        menuItem.set("select",false);
        console.log("menuItem code:" + menuItem.get("typecode") + "|and menu code:" + menu.get("typecode"));
        //如果一致，则改变
        if(menuItem.get("typecode")===menu.get("typecode")){
          menuItem.set("select",true);
          _self.sendAction("switchTab",menu.get("typecode"));
        }
      });
      this.set("menus",menus);
      console.log("menus after:",menus);
    },
  },



});
