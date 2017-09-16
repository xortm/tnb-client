import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  feedBus: Ember.inject.service("feed-bus"),
  infiniteContentPropertyName: "assessmentList",
  infiniteModelName: "assessment",
  infiniteContainerName:"employeeAssessmentContainer",
  stopScroll: true,
  queryFlagInFlag: 0,
  constants:Constants,

  customerObs: function(){
    let _self = this;
    var employeeId = this.get("attendanceEmployeeId");
    console.log("employeeId in log",employeeId);
    if(!employeeId){
      console.log("employeeId in log in !",employeeId);
      this.set("noEmployeeId",true);
      _self.hideAllLoading();
      return;
    }else{
      this.set("stopScroll",false);
    }
    this.set("noEmployeeId",false);
    this.set("employeeId",employeeId);
    console.log("ynamicsList in employeeId",employeeId);
    let params = {};
    if(employeeId != "all"){
      params = {filter:{
          examiner:{id:employeeId},
      }};
    }
    let sort = {
      examTime:"desc",
    };
    params.sort = sort;
    console.log("params:",params);
    _self.get("feedBus").set("assessmentFlag",false);
    this.infiniteQuery('assessment',params);
  }.observes("attendanceEmployeeId").on("init"),

//只有当当前页面时route是service-care时,才会把切换以后的老人id传递给组件,使其加载数据
  attendanceEmployeeIdObs: function(){
    var employeeId = this.get("global_curStatus.attendanceEmployeeId");
    var curRoutePath=this.get('global_pageConstructure').get('curRouteName');
    if(curRoutePath === "employee-assessment"){
      this.set("attendanceEmployeeId",employeeId);
    }
  }.observes("global_curStatus.attendanceEmployeeId").on("init"),


  actions:{
    addAssessment:function(){
      var _self = this;
      var employeeId = this.get("employeeId");
      var itemId = "employee-assessment";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        var detailController = App.lookup("controller:business");
        if(!employeeId){
          detailController.popTorMsg("请在上方选择员工!");
          return;
        }
        if(employeeId === "all"){
          detailController.popTorMsg("请在上方选择具体员工!");
          return;
        }
        Ember.run.later(function(){
          var params = {
            itemIdFlag:Math.random(),
            itemId:employeeId,
            source:'add'
          };
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('employee-assessment-detail',params);
        },100);
      },200);
    },
    switchShowAction(){
      this.directInitScoll();
      //当第一次进入页面时,才把全部选好的老人id传给组件
      var employeeId = this.get("global_curStatus.attendanceEmployeeId");
      this.set("attendanceEmployeeId",employeeId);
      let assessmentFlag = this.get("feedBus").get("assessmentFlag");
      if(assessmentFlag){
        this.customerObs();
      }
    },


  },

});
