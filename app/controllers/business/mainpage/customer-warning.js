import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "hbeaconwarningList",
  infiniteModelName: "hbeaconwarning",
  infiniteContainerName:"customerWarningContainer",
  queryFlagInFlag: 0,
  constants:Constants,

  customerObs: function(){
    var _self = this;
    console.log("queryFlagInFlag:",this.get("queryFlagInFlag"));
    this.infiniteQuery('hbeaconwarning',{filter:{'scannerId@$isNotNull':'null'},sort:{callTime:'desc'}});
  }.observes("queryFlagInFlag").on("init"),

  //当添加完说明后执行此操作
  customerListObs: function(){
    var _self = this;
    if(!this.get("customerListFlag")){
      return;
    }
    var hbeaconwarningList = this.get("hbeaconwarningList");
    console.log("hbeaconwarningList in Obs:",hbeaconwarningList);
    //获取保存在feedService里面的数据
    let warningItem = this.get("feedService").get("serviceData");
    console.log("warningItem in out obs:",warningItem);
    if(warningItem){
      console.log("warningItem in obs:",warningItem);
      console.log("warningItem flag:",warningItem.get("flag"));
      console.log("warningItem typename:",warningItem.get("flag.typename"));
      console.log("warningItem operateNote:",warningItem.get("operateNote"));
      //遍历list将id相同的数据更新一下
      hbeaconwarningList.forEach(function(hbeaconwarning){
        if(hbeaconwarning.get("id")===warningItem.get("id")){
          console.log("hbeaconwarning in forEach:",hbeaconwarning);
          hbeaconwarning.set("flag",warningItem.get("flag"));
          hbeaconwarning.set("operater",warningItem.get("operater"));
          hbeaconwarning.set("operateNote",warningItem.get("operateNote"));
          hbeaconwarning.set("operateTime",warningItem.get("operateTime"));
          hbeaconwarning.set("operateTimeShortString",_self.operateTimeShortString(warningItem.get("operateTime")));
          console.log("hbeaconwarning after in forEach:",hbeaconwarning);
          _self.get("feedService").set("serviceData",null);//重置feedbus数据
        }
      });
    }
    _self.set("hbeaconwarningList",hbeaconwarningList);
  }.observes("customerListFlag").on("init"),

  //处理operateTime为特定格式
  operateTimeShortString(operateTime){
    var timeStr = this.get("dateService").formatDate(operateTime, "MM-dd hh:mm");
    var timeString = timeStr.replace(/-0/,"月");
    timeString = timeString.replace(/-/,"月");
    timeString = timeString.replace(/ /,"日 ");
    console.log("timeString.charAt(0):",timeString.charAt(0));
    if(timeString.charAt(0) == "0"){
      var operateTimeShortString = timeString.substring(1);
      return operateTimeShortString;
    }else{
      return timeString;
    }
  },

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

  },

});
