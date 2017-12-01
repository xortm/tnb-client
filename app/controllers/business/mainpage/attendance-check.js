import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "staffattendanceList",
  infiniteModelName: "staffattendance",
  infiniteContainerName:"attendanceCheckContainer",
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
    let filter = {};
    if(employeeId != "all"){
      filter={
          employee:{id:employeeId},
      };
    }
    //时间搜索，拼接filter
    if(this.get("global_curStatus.attendanceTimeSearchFlag")){
      let firstSecond = this.get('global_curStatus.searchTimeFirst');
      let lastSecond = this.get('global_curStatus.searchTimeLast');
      filter = $.extend({}, filter, {'attendanceTime@$gte':firstSecond,'attendanceTime@$lte':lastSecond});
    }

    let sort = {
      attendanceTime:"desc",
    };
    params.filter = filter;
    params.sort = sort;
    console.log("params:",params);
    this.infiniteQuery('staffattendance',params);
  }.observes("attendanceEmployeeId","global_curStatus.attendanceTimeSearchFlag").on("init"),

//只有当当前页面时route是service-care时,才会把切换以后的老人id传递给组件,使其加载数据
  attendanceEmployeeIdObs: function(){
    var employeeId = this.get("global_curStatus.attendanceEmployeeId");
    var curRoutePath=this.get('global_pageConstructure').get('curRouteName');
    if(curRoutePath === "attendance-check"){
      this.set("attendanceEmployeeId",employeeId);
    }
  }.observes("global_curStatus.attendanceEmployeeId").on("init"),

  actions:{
    switchShowAction(){
      this.directInitScoll();
      //当第一次进入页面时,才把全部选好的老人id传给组件
      var employeeId = this.get("global_curStatus.attendanceEmployeeId");
      this.set("attendanceEmployeeId",employeeId);
      this.set('global_curStatus.searchTimeFirst',null);
      this.set('global_curStatus.searchTimeLast',null);
      this.set("global_curStatus.attendanceTimeSearchFlag",0);
    },

  },

});
