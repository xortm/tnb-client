import Ember from 'ember';

import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userBusinessMineContainer",
  scrollPrevent: true,

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  // queryFlagIn: function(){return;},

  isMobile: Ember.computed(function () {
    console.log("isMobile in:", this.get("global_curStatus").get("isMobile"));
    return this.get("global_curStatus").get("isMobile");
  }),//移动端

  // sex: Ember.computed(function() {
  //   if(this.get('model.curUser.sex')===2) {
  //     return '女';
  //   } return '男';
  // }).property('model.curUser.sex'),
  // sex2: Ember.computed(function() {
  //   console.log("this.get('model.curUser.sex'",this.get('model.curUser.sex'));
  //   if(this.get('model.curUser.sex')===2) {
  //     return true;
  //   } return false;
  // }).property('model.curUser.sex'),
  // sex1: Ember.computed(function() {
  //   console.log("this.get('model.curUser.sex'",this.get('model.curUser.sex'));
  //   if(this.get('model.curUser.sex')===1) {
  //     return true;
  //   } return false;
  // }).property('model.curUser.sex'),
  init:function(){
    this.hideAllLoading();
  },

  actions:{
    sexFun2:function(){
      var curUser = this.get('global_curStatus').getUser();
      this.store.findRecord("user",curUser.get("id")).then(function(userEnt){
        userEnt.set('sex',2);
        userEnt.save();
      });
      this.set('changeSexModel',false);
    },
    sexFun1:function(){
      var curUser = this.get('global_curStatus').getUser();
      this.store.findRecord("user",curUser.get("id")).then(function(userEnt){
        userEnt.set('sex',1);
        userEnt.save();
      });
      this.set('changeSexModel',false);
    },
    // sexFun:function(){
    //   this.set('changeSexModel',true);
    // },
    closeFun:function(){
      this.set('changeSexModel',false);
    },
    //页面跳转
    // modification:function (amend,elementId) {
    //   var params = {source:amend};
    //   var _self = this;
    //   var itemId = elementId;
    //   $("#" + itemId).addClass("tapped");
    //   Ember.run.later(function(){
    //     $("#" + itemId).removeClass("tapped");
    //     Ember.run.later(function(){
    //       _self.get("mainController").switchMainPage('myinfo-item-edit',params);
    //     },100);
    //   },200);
    // },
    //跳转选择 self-choose
    // toSelfChoose:function (amend,elementId) {
    //   var params = {source:amend};
    //   var _self = this;
    //   var itemId = elementId;
    //   $("#" + itemId).addClass("tapped");
    //   Ember.run.later(function(){
    //     $("#" + itemId).removeClass("tapped");
    //     Ember.run.later(function(){
    //       _self.get("mainController").switchMainPage('self-choose',params);
    //     },100);
    //   },200);
    // },
  },
});
