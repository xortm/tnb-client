import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "executionReportList",
  infiniteModelName: "executionReport",
  infiniteContainerName:"fileImplementHistoryContainer",

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  init: function(){
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
     var _self = this;
    _self.infiniteQuery("executionReport",{
      filter:{customer:{id:curCustomerId}},
      sort:{createTime:"desc"}
    }).then(function(executionReportList){
      if(!executionReportList&&executionReportList.get("length")===0){
        _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
      }
      console.log("executionReportList",executionReportList);
      // executionReportList = executionReportList.splice(1);
      console.log("executionReportList",executionReportList);
      _self.set("executionReportList",executionReportList);
    });
  },

  actions:{
    goDetail(executionReport){
      console.log("go detail",executionReport);
      var id = executionReport.get("id");
      console.log("go detail id",id);
      var params ={
        executionReportId:id
      };
      var itemId = "executionReportItem_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('file-implement-detail',params);
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
