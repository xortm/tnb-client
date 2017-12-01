import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"customerBusinessContainer",
  stopScroll: true,//阻止下拉刷新的所有操作

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  global_curStatus: Ember.inject.service('current-status'),
  feedService: Ember.inject.service('feed-bus'),
  constants:Constants,
  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_Scan_customerBusiness', this, 'showScanCustomerBusiness');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_Scan_customerBusiness', this, 'showScanCustomerBusiness');
  }.on('willDestroyElement'),

  showScanCustomerBusiness: function(){
    var itemId = "customer-business-scan";
    $("#" + itemId).addClass("tapped");
    Ember.run.later(function(){
      $("#" + itemId).removeClass("tapped");
      Ember.run.later(function(){
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('scanQRCode',{type:'customerBusiness'});
        // mainpageController.switchMainPage('scan-qrcode');
        // alert("in action showScan switch");
      },100);
    },200);
  },

  customerObs: function(){
    var _self = this;
    var customerId = this.get("global_curStatus.healtyCustomerId");
    if(!customerId){
      this.set("nocustomerId",true);
      this.hideAllLoading();
      return;
    // }else{
    //   this.set("stopScroll",false);
    }
    // var healtyCustomer  = this.get("global_curStatus.healtyCustomer");
    var healtyCustomer = this.store.peekRecord('customer',customerId);
    console.log("customerId:",customerId);
    console.log("healtyCustomer:",healtyCustomer);
    console.log("healtyCustomer guardianFirstName:",healtyCustomer.get("name"));
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    this.set("healtyCustomer",healtyCustomer);
    this.hideAllLoading();
    this.directInitScoll(true);
  }.observes("global_curStatus.healtyCustomerId","queryFlagInFlag").on("init"),

  queryFlagIn(){
    this.incrementProperty("queryFlagInFlag");
  },

  actions:{
    //页面跳转
    switchPage:function (menuLink,elementId) {
      console.log("id```````",elementId);
      var _self = this;
      var itemId = elementId;
      var params = {};
      // params= {healtyCustomerId:_self.get("customerId"),itemIdFlag:Math.random()};
      params= {healtyCustomerId:_self.get("customerId")};
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage(menuLink,params);
        },100);
      },200);
    },
  },

});
