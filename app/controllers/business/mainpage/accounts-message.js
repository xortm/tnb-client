import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  mainController: Ember.inject.controller('business.mainpage'),

  infiniteContentPropertyName: "theCustomerList",
  infiniteModelName: "customer",
  infiniteContainerName:"theCustomerContainer",
  stopScroll: true,//阻止下拉刷新的所有操作
  init:function(){
    console.log("run in init");
  },
  customerObs: function(){
    let _self = this;
    var commonInitHasCompleteFlag = this.get("global_curStatus.commonInitHasCompleteFlag");
    console.log("queryObs run commonInitHasCompleteFlag",commonInitHasCompleteFlag);
    if(!commonInitHasCompleteFlag){
      return;
    }
    let customer = this.get("global_curStatus").getCustomer();
    console.log("customer in public",customer);
    console.log("customer in public name",customer.get("name"));
    console.log("customer in public allBedName",customer.get("bed.allBedName"));
    console.log("customer in public BedId",customer.get("bed.id"));
    if(!customer||!customer.get("id")){
      return;
    }
    var customerId = customer.get("id");
    let allBeds = _self.get("global_dataLoader.allBedList");
    console.log("allBeds",allBeds);
    allBeds.forEach(function(bedItem){
      if(bedItem.get("id")==customer.get("bed.id")){
        customer.set("bed",bedItem);
      }
    });
    console.log("customer in public allBedName after",customer.get("bed.allBedName"));
    this.set("customer",customer);
    this.hideAllLoading();
  }.observes("global_curStatus.commonInitHasCompleteFlag").on("init"),
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
          if(menuLink == "live-video"){
            App.lookup('controller:business.mainpage').showMobileVideoBox();
            return ;
          }
          _self.get("mainController").switchMainPage(menuLink);
        },100);
      },200);
    },

  },
});
