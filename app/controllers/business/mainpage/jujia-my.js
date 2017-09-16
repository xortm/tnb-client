import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userJujiaMyContainer",
  moment: Ember.inject.service(),
  statusService: Ember.inject.service("current-status"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  constants:Constants,
  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  queryFlagIn: function(){return;},
  curCustomerObs: function() {
    //let curCustomer = this.get("statusService.curStatus.currentCustomer");
    let curCustomer = this.get("statusService").getCustomer();
    console.log("curCustomer in jujia",curCustomer);
    if(!curCustomer||!curCustomer.get("id")){
      return;
    }
    this.set("curCustomer",curCustomer);
  }.observes("statusService.curStatus.currentCustomer").on("init"),
  actions:{
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
    logout:function(elementId){
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
