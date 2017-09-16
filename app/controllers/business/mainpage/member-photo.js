import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userMemberPhotoContainer",

  moment: Ember.inject.service(),
  dataLoader: Ember.inject.service("data-loader"),
  feedService: Ember.inject.service('feed-bus'),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),

  constants:Constants,

  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),
  queryFlagIn: function(){return;},

  actions:{
    // uploadSucc: function(response) {
    //   var curCustomer = this.get("curCustomer");//获取居家curCustomer
    //   console.log("curCustomer in con",curCustomer);
    //   var res = JSON.parse(response);
    //   var picPath = res.relativePath;
    //   let _self = this;
    //   console.log("picPath", picPath);
    //   curCustomer.set("headImg",picPath);
    //   curCustomer.save().then(function(){
    //     var avatarUrl = this.get("pathConfiger").getAvatarRemotePath(picPath);
    //     _self.get("global_curStatus").getCustomer().set("headImg",picPath);
    //     _self.get("global_curStatus").getCustomer().set("avatarUrl",avatarUrl);
    //     console.log("global_curStatus headImg:",_self.get("global_curStatus").getCustomer().get("headImg"));
    //     console.log("global_curStatus avatarUrl:",_self.get("global_curStatus").getCustomer().get("avatarUrl"));
    //     App.lookup("controller:business").popTorMsg("头像上传成功！");
    //   });
    // },
    uploadSucc: function(response) {
      var curCustomerId = this.get("curCustomer.id");//获取居家curCustomerId
      console.log("curCustomerId in con",curCustomerId);
      var res = JSON.parse(response);
      var picPath = res.relativePath;
      let _self = this;
      console.log("picPath", picPath);
      var avatarUrl = _self.get("pathConfiger").getAvatarRemotePath(picPath);
      // console.log("global_curStatus avatarUrl:",_self.get("global_curStatus").getCustomer().get("avatarUrl"));
      _self.get("global_curStatus").getCustomer().set("headImg",picPath);
      _self.get("global_curStatus").getCustomer().set("avatarUrl",avatarUrl);
      // console.log("global_curStatus headImg:",_self.get("global_curStatus").getCustomer().get("headImg"));
      // console.log("global_curStatus avatarUrl:",_self.get("global_curStatus").getCustomer().get("avatarUrl"));
      _self.store.findRecord("customer",curCustomerId).then(function(curCustomer){
        curCustomer.set("headImg",picPath);
        curCustomer.save().then(function(){
          App.lookup("controller:business").popTorMsg("头像上传成功！");
        });
      });
    },

    uploadFail: function(errorText) {
      App.lookup("controller:business").popTorMsg(errorText);
    },

    switchPage: function (menuLink,elementId) {//个人信息 界面
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
