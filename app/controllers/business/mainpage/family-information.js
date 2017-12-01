import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"familyInformationContainer",
  stopScroll: true,//阻止下拉刷新的所有操作

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  global_curStatus: Ember.inject.service('current-status'),
  feedService: Ember.inject.service('feed-bus'),
  constants:Constants,
  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/

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
  },

});
