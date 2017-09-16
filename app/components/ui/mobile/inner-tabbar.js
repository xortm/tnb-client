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
  },
  clickActFlagObs: function(){
    console.log("clickActFlagObs in");
    //通过clickActFlag实现外部对于点击的直接调用
    var tabCode=this.get("clickActFlag");
    var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
    console.log('conTabCodeTest ',this.get("dataLoader").get('conTabCode')+"  "+tabCode+"  "+curRoutePath);
    if(curRoutePath==="consultation-detail-mobile"||curRoutePath==="consultation-edit-mobile"||curRoutePath==="backvist-detail-mobile"||curRoutePath==="backvist-edit-mobile"||curRoutePath==="workdelivery-self-mobile"){
      if(this.get("dataLoader").get('conTabCode')){
        tabCode=this.get("dataLoader").get('conTabCode');
      }
    }
    console.log('conTabCodeTest2 ',this.get("dataLoader").get('conTabCode')+"  "+tabCode);
    var menuItem = Ember.Object.create({
      code:tabCode
    });
    this.send("menuClick",menuItem);
  }.observes("clickActFlag","refreshFlag").on("init"),

  actions:{
    menuClick(menu){
      var _self = this;
      console.log("menuitem in tab btnFlag",this.get("btnFlag"),this.get("serviceListFlag"));
      console.log("menuitem in tab",menu);
      // if(this.get("btnFlag")){return;}//如果是true就不让点击下去 没有加载完是true 不让再点击
      this.get("menus").forEach(function(menuItem){
        if(menuItem.get("selected")){
          //记录原菜单页面
          _self.set("oriMenuCode",menuItem.get("code"));
        }
        menuItem.set("selected",null);
        console.log("menuItem code:" + menuItem.get("code") + "|and menu code:" + menu.get("code"));
        //如果一致，则改变
        if(menuItem.get("code")===menu.get("code")){
          // _self.set("showLoadingImgIn",true);
          // _self.set("btnFlag",true);
          menuItem.set("selected","selected");
        }
      });
    },
    menuChange(menu){
      console.log("menuChange in,menu",menu);
      if(menu.get("selected")){
        //触发页面跳转
        console.log("need send tab action:" + this.get("oriMenuCode"));
        this.sendAction("switchTab",menu.get("code"));
      }
    }
  }
});
