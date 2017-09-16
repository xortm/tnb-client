import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userSportsUploadContainer",

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,

  queryFlagIn: function(){return;},

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
    sportTypeSelect: function(dict) {
        this.set("sportType", dict);
        // this.set('sportType', dict);
        console.log("dict111",dict);
    },
    saveItem:function(){
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
      let _self = this;
      var sportTime = this.get('sportTime');
      console.log("sportTime",sportTime);
      var sportType = this.get("sportType");
      console.log("sportType",sportType);
      //this.set('tipInfo', "");
      if ('undefined' === typeof(sportType) || '' === sportType) {
        App.lookup("controller:business").popTorMsg("事项不能为空!");
          // this.set('tipInfo', "事项不能为空");
          return ;
      }
      if ('undefined' === typeof(sportTime) || '' === sportTime) {
        App.lookup("controller:business").popTorMsg("时长不能为空!");
          // this.set('tipInfo', "时长不能为空");
          return ;
      }
      this.set('tipInfo', "");
      var typeObj = this.get("dataLoader").findDict(Constants.schemeType2);
      console.log("typeObj is", typeObj);
      this.store.findRecord('customer',curCustomerId).then(function(customer){
        var schemeRecord = _self.store.createRecord('schemeRecord', {
          type:typeObj,
          sportType:sportType,
          sportTime:sportTime,
          customer:customer,
        });
        schemeRecord.save().then(function(){
          App.lookup("controller:business").popTorMsg("运动上传成功!");
          App.lookup('controller:business.mainpage').switchMainPage('healthy-plan-sports');
        });
      });
      //  清空页面的input输入框
      this.set('sprotTime', "");
    },

  },

});
