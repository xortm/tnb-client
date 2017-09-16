import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userCsInfoContainer",
  stopScroll: true,//阻止下拉刷新的所有操作

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  global_curStatus: Ember.inject.service('current-status'),

  constants:Constants,

  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  isMobile: Ember.computed(function () {return this.get("global_curStatus").get("isMobile");}),  //移动端
  name:Ember.computed(function(){return this.get("model.curUser").get('name');}),
  address:Ember.computed(function(){return this.get("model.curUser").get('address');}),
  phone:Ember.computed(function(){return this.get("model.curUser").get('phone');}),
  email:Ember.computed(function(){return this.get("model.curUser").get('email');}),
  age:Ember.computed(function(){return this.get("model.curUser").get('age');}),

  init:function(){
    this.hideAllLoading();
  },

  //判断是否显示多余条目信息
  footBarMenusShowFlag: Ember.computed('global_curStatus.footBarMenusShowFlag', function() {
    var globalCurStatus = this.get('global_curStatus');
    var footBarMenusShowFlag = globalCurStatus.get("footBarMenusShowFlag");
    console.log("footBarMenusShowFlag in cs-info",footBarMenusShowFlag);
    if(footBarMenusShowFlag === "cs-user"){
      return true;
    }else{
      return false;
    }
  }),

  actions:{
    //页面跳转
    // toBelongTeam:function(menuLink){//所属组队 界面
    //   this.get("mainController").switchMainPage(menuLink);
    // },
    // toMySettings: function(menuLink){//设置 页面
    //   this.get("mainController").switchMainPage(menuLink);
    // },
    switchPage:function (menuLink,elementId) {//个人信息 界面
      console.log("id```````",elementId);
      var _self = this;
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage(menuLink);
        },100);
      },200);
    },
  },

});
