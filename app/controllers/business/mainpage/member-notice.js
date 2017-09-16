import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "messageList",
  infiniteModelName: "message",
  infiniteContainerName:"messageContainer",

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),

  constants:Constants,

  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  init: function() {
    var _self = this;
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    console.log("curCustomer in setupController",curCustomer);
    this.set("curCustomer",curCustomer);
    var curUser = this.get("statusService").getUser();//获取当前user
    var curUserId = curUser.get("id");
    //获取通知数据
    this.infiniteQuery("message",{
      filter:{
        toUser:{id:curUserId},
        type:4,
      },
      sort:{createTime:"desc"}
    }).then(function(messageList){
      if(!messageList&&messageList.get("length")===0){
        _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
      }
      console.log("messageList",messageList);
      _self.set("messageList",messageList);
    });
  },

  actions:{
    goDetail(message){
      console.log("go detail",message);
      var id = message.get("id");
      console.log("go detail id",id);
      var params ={
        messageId:id
      };
      var itemId = "messageItem_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('message-detail',params);
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
