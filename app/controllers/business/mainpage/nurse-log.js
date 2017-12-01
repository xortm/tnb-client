import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "nurLogList",
  infiniteModelName: "nursinglog",
  infiniteContainerName:"nurLogContainer",
  stopScroll: true,//阻止下拉刷新的所有操作
  logFlag:0,//添加日志的flag
  nocustomerId:false,

  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_Scan_nurseLog', this, 'showScanNurseLog');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_Scan_nurseLog', this, 'showScanNurseLog');
  }.on('willDestroyElement'),

  showScanNurseLog: function(){
    var itemId = "nurse-log-scan";
    $("#" + itemId).addClass("tapped");
    Ember.run.later(function(){
      $("#" + itemId).removeClass("tapped");
      Ember.run.later(function(){
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('scanQRCode',{type:'nurseLog'});
        // mainpageController.switchMainPage('scan-qrcode');
        // alert("in action showScan switch");
      },100);
    },200);
  },

  customerObs: function(){
    var _self = this;
    this.incrementProperty("logFlag");
    var customerId = this.get("global_curStatus.logCustomerId");
    console.log("customerId in log",customerId);
    if(!customerId){
      console.log("customerId in log in !",customerId);
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    console.log("ynamicsList in customer",customerId);
    var sevenDate = this.get("dateService").getDaysBeforeTimestamp(7);
    var params = {filter:{
      nurscustomer:{id:customerId},
      'recordTime@$gte': sevenDate,
    }};
    var sort = {
      recordTime:"desc",
      nursingDate:"desc",
    };
    params.sort = sort;
    this.infiniteQuery('nursinglog',params);
  }.observes("global_curStatus.logCustomerId","dynamicsFlag").on("init"),

  actions:{
    theEdit:function(nursinglogId,nursingId){
      var logFlag = this.get("logFlag");
      var itemId = "nosinglog_"+nursinglogId;
      var user = this.get("global_curStatus").getUser();//获取到当前人
      var curnursingId = user.get("employee.id");
      var customerId = this.get("customerId");
      var _self = this;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        if(!customerId){
          var detailController = App.lookup("controller:business");
          detailController.popTorMsg("请在上方选择老人!");
          return;
        }
        Ember.run.later(function(){
          var params = {};
          console.log("curnursingId111",curnursingId,'log nursingId: ',nursingId);
          if(nursingId==curnursingId){
            params = {
              logFlag:logFlag,
              nursinglogId:nursinglogId,
              customerId:customerId,
              source:'edit'
            };
          }else {
            params = {
              logFlag:logFlag,
              nursinglogId:nursinglogId,
              customerId:customerId,
              source:'look'
            };
          }
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('dynamics-detail',params);
        },100);
      },200);
    },
    addDynamics:function(){
      var _self = this;
      var logFlag = this.get("logFlag");
      var customerId = this.get("customerId");
      var itemId = "detail_dynamicsbtn";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        if(!customerId){
          var detailController = App.lookup("controller:business");
          detailController.popTorMsg("请在上方选择老人!");
          return;
        }
        Ember.run.later(function(){
          var params = {
            logFlag:logFlag,
            customerId:customerId,
            source:'add'
          };
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('dynamics-detail',params);
        },100);
      },200);
    },
    switchShowAction(){
      this.directInitScoll();
    },

  },

});
