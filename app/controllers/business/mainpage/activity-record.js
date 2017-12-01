import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "activityOrderList",
  infiniteModelName: "activityOrder",
  infiniteContainerName:"activityRecordContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),
  dateService:Ember.inject.service('date-service'),

  constants:Constants,

  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  init: function() {
    var _self = this;
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    console.log("curCustomer in setupController",curCustomer);
    var timestamp = this.get("dateService").getCurrentTime();
    console.log("timestamp:",timestamp);
    //获取通知数据
    this.infiniteQuery("activityOrder",{
      filter:{
        customer:{id:curCustomerId},
        "activityTime@$lte":timestamp
      },
      sort:{
        activityTime:"desc"
      }
    }).then(function(activityOrderList){
      console.log("activityOrderList",activityOrderList);
      //_self.set("activityOrderList",activityOrderList);
      //重新定义
      var activityIdArray = []; //存活动id的数组
      var activityArray = []; //存活动的数组
      activityOrderList.forEach(function(activityOrder) {
          console.log("activityOrder init",activityOrder);
          var activity = activityOrder.get('activityPlan.activity'); //活动类型
          var activityId = activityOrder.get('activityPlan.activity.id'); //活动类型id
          console.log("activity in array:",activity);
          console.log("activityId in array:",activityId);
          console.log("activityIdArray11:",activityIdArray);
          console.log("activityArray11:",activityArray);
          if (activityIdArray.indexOf(activityId) == -1) {
            //将活动推入数组
            activityIdArray.push(activityId);
            activityArray.push(activity);
          }
          console.log("activityIdArray22:",activityIdArray);
          console.log("activityArray22:",activityArray);
      });
      console.log("activityArray last:",activityArray);
      _self.set("activityArray",activityArray);


    });
  },

  actions:{
    goDetail(activity){
      console.log("go detail",activity);
      var id = activity.get("id");
      console.log("go detail id",id);
      var params ={
        id:id
      };
      var itemId = "activity_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('activity-record-item',params);
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
