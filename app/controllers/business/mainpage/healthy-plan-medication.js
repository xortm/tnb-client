import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userHealthyPlanMedicationContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,

  init: function(){
    this.queryFlagIn();
  },
  queryFlagIn: function(){
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
     var _self = this;
     _self._showLoading();
    _self.store.query("drugAdvice",{
      filter:{'[customer][id]':curCustomerId},
    }).then(function(drugAdviceList){
      console.log("drugAdviceList",drugAdviceList);
      let drugAdvice =  drugAdviceList.get("firstObject");
      console.log("drugAdvice",drugAdvice);
      _self.set("drugAdvice",drugAdvice);
      _self.hideAllLoading();
    });
},

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
