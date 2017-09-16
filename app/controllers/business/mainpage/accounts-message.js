import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  mainController: Ember.inject.controller('business.mainpage'),

  infiniteContentPropertyName: "theCustomerList",
  infiniteModelName: "customer",
  infiniteContainerName:"theCustomerContainer",
  scrollPrevent:true,
  init:function(){
    console.log("run in init");
    this.hideAllLoading();
  },
  actions:{
    recharge(customerId){
      console.log(" in it recharge recharge");
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('accounts-recharge',{customerId:customerId});
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
