import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "theUserList",
  infiniteModelName: "user",
  infiniteContainerName:"theUserContainer",

  mainController: Ember.inject.controller('business.mainpage'),
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
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").send("quit");
        },100);
      },200);
    },
  },

});
