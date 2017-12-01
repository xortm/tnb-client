import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "theUserList",
  infiniteModelName: "user",
  infiniteContainerName:"theUserContainer",
  stopScroll: true,//阻止下拉刷新的所有操作

  mainController: Ember.inject.controller('business.mainpage'),
  init:function(){
    console.log("cs info ctl init");
    this.hideAllLoading();
  },
  actions:{
    changePassword: function(menuLink,elementId){//修改密码
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
    signOut:function(elementId){
      var _self = this;
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      let params = {close:true};
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").send("quit",params);
        },100);
      },200);
    },
  },

});
