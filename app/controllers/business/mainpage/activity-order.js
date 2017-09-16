import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userActivityOrderContainer",

  moment: Ember.inject.service(),
  feedService: Ember.inject.service('feed-bus'),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  queryFlagIn: function(){return;},
  //初始化select
  init:function(){
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      // _self.showOrderItem();
    });
  },
  initOrderItemObs:function(){
    console.log("initOrderItemObs 11111111111111");
    var activityList = this.get("activityList");
    if(!activityList){return;}
    var activityId = activityList.get("firstObject").get("id");
    this.showOrderItem(activityId);
  }.observes("activityList").on("init"),

  //根据id获取activityPlanList
  showOrderItem:function(activityId){
    console.log("activityId in init",activityId);
    var _self = this;
    this.store.query("activityPlan",{
      filter:{
        activity:{id:activityId}
      }
    }).then(function(activityPlanList){
      _self.set("activityPlanList",activityPlanList);
      console.log("activityPlanList in init",activityPlanList);
    });
  },

  actions:{
    //根据select获取activityID
    selectOrderItem:function(){
      console.log("select yes");
      var activityId = document.getElementById("orderItem").value;
      this.showOrderItem(activityId);
    },
    //执行保存操作
    saveItem:function(){
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
      let _self = this;
      let activityId = document.getElementById("orderItem").value;
      console.log("activityId",activityId);
      let activityPlanId = document.getElementById("orderTime").value;
      console.log("activityPlanId",activityPlanId);
      let employeeId = document.getElementById("orderEmployee").value;
      console.log("employeeId",employeeId);
      _self.store.findRecord('employee',employeeId).then(function(employee){
        console.log("employee in model",employee);
        _self.store.findRecord('activityPlan',activityPlanId).then(function(activityPlan){
          console.log("activityPlan in model",activityPlan);
          var activityOrder = _self.store.createRecord('activityOrder', {
            activityPlan:activityPlan,
            employee:employee,
            customer:curCustomer,
          });
          //drugRecord.set("createTime",createTime);
          activityOrder.save().then(function(){
            App.lookup("controller:business").popTorMsg("预约成功!");
            App.lookup('controller:business.mainpage').switchMainPage('jujia-activity');
          },function(err){
            let error = err.errors[0];
            if(error.code==="2"){
              App.lookup("controller:business").popTorMsg("您已经预约了该活动");
            }
          });
        });
      });
    },

  },

});
