import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userHealthyPlanDietContainer",

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
    this._showLoading();
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
     var _self = this;
    _self.store.query("relCustomerScheme",{
      filter:{
        customer:{id:curCustomerId},
        scheme:{
          // isChose:1,
          type:{typecode:"schemeType1"}
        }
      },
      sort:{
        scheme:{createTime:"desc"}
      }
    }).then(function(relCustomerSchemeList){
      let relCustomerScheme =  relCustomerSchemeList.get("firstObject");
      console.log("relCustomerScheme",relCustomerScheme);
      _self.set("relCustomerScheme",relCustomerScheme);
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
