import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "activityOrderList",
  infiniteModelName: "activityOrder",
  infiniteContainerName:"userActivityRecordItemContainer",
  statusService: Ember.inject.service("current-status"),
  dateService:Ember.inject.service('date-service'),

  observeGotoWork:function(){
    //获取居家curCustomer
    var curCustomer = this.get("statusService").getCustomer();
    var curCustomerId = curCustomer.get("id");
    //获取messageid
    var _self = this;
    var id = this.get("id");
    console.log("activity id","id");
    var timestamp = this.get("dateService").getCurrentTime();
    console.log("timestamp:",timestamp);
    _self.infiniteQuery('activityOrder',{
      filter:{
        activityPlan:{activity:{id:id}},
        customer:{id:curCustomerId},
        "activityTime@$lt":timestamp
      },
      sort:{
        activityTime:"desc"
      }
    }).then(function(activityOrderList){
      // var activityOrderLast = activityOrderList.get("firstObject");
      console.log("activityOrderList:",activityOrderList);
      _self.set("activityOrderList",activityOrderList);
    });
  }.observes('id'),

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

  },

});
