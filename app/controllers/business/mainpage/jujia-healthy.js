import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userJujiaHealthyContainer",
  stopScroll:true,

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),

  constants:Constants,

  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  isMobile: Ember.computed(function () {return this.get("global_curStatus").get("isMobile");}),  //移动端
  name:Ember.computed(function(){return this.get("curUser").get('name');}),
  address:Ember.computed(function(){return this.get("model.curUser").get('address');}),
  phone:Ember.computed(function(){return this.get("model.curUser").get('phone');}),
  email:Ember.computed(function(){return this.get("model.curUser").get('email');}),
  age:Ember.computed(function(){return this.get("model.curUser").get('age');}),
  queryFlagIn: function(){return;},

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
