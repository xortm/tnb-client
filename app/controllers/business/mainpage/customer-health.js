import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  feedService: Ember.inject.service('feed-bus'),

  infiniteContentPropertyName: "healthInfoList",
  infiniteModelName: "health-info",
  // infiniteModelSort: "examDateTime:desc",
  infiniteContainerName:"healthInfoContainerDetail",
  stopScroll: true,//阻止下拉刷新的所有操作

  sourceFlag:"fromHand",

  customerObs: function(){
    var _self = this;
    var customerId = this.get("healtyCustomerId");
    console.log("healtyCustomerId in obs:",customerId);
    if(!customerId){
      this.set("nocustomerId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
    this.set("nocustomerId",false);
    this.set("customerId",customerId);
    var sourceFlag = this.get("sourceFlag");
    console.log("sourceFlag",sourceFlag);
    if(sourceFlag=="fromHand"){
      this.set("healthMessage","(日四)");
    }else {
      this.set("healthMessage","(全部)");
    }

    this.set("hasRender",true);
    this.set("oriTaskId",customerId);
    var thirtyDate = _self.get("dateService").getDaysBeforeTimestamp(30);
    var params = {};
    if(sourceFlag){
      sourceFlag = sourceFlag.toString();
      params = {sort: {'[examDateTime]': 'desc'},filter:{
        examUser:{id:customerId},
        'examDateTime@$gte': thirtyDate,
        sourceFlag:sourceFlag,
        healthInfoQueryType:"normal"
      }};
    }else {
      params = {sort: {'[examDateTime]': 'desc'},filter:{
        examUser:{id:customerId},
        'examDateTime@$gte': thirtyDate,
        healthInfoQueryType:"normal"
      }};
    }
    console.log("infiniteQuery run");
    this.infiniteQuery('health-info',params);
  }.observes("healthFlag","healtyCustomerId","sourceFlag").on("init"),

  actions:{
    queryAllOrOther(){
      var otherChoose = this.get("otherChoose");
      if(otherChoose){
        this.set("otherChoose",false);
      }else {
      }
      this.set("otherChoose",true);
    },
    closeAllOrOther(){
      this.set("otherChoose",false);
    },
    queryHealth(type){
      if(type=="all"){
        this.set("sourceFlag","");//set为空 查询全部
      }else {
        this.set("sourceFlag","fromHand");
      }
      this.set("otherChoose",false);
    },
    showText(text,eleId){
      var _self = this;
      var itemId = "healthInfo_"+eleId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          console.log("init text",text);
          _self.set("showModel",true);
          _self.set("showContent",text);
        },100);
      },200);
    },
    closeText(){
      this.set("showModel",false);
    },
    addHealth:function(){
      var _self = this;
      var flag = Math.random();
      var customerId = this.get("customerId");
      var itemId = "detail_healthbtn";
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
            customerId:customerId,
            flag:flag,
            source:'add'
          };
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('health-mobile-detail',params);
        },100);
      },200);
    },
    switchShowAction(){
      this.directInitScoll();
    },

  },
});
