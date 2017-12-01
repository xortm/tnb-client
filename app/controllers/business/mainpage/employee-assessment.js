import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  dataLoader:Ember.inject.service('data-loader'),
  feedService: Ember.inject.service('feed-bus'),
  feedBus: Ember.inject.service("feed-bus"),
  global_curStatus:Ember.inject.service('current-status'),
  infiniteContentPropertyName: "assessmentList",
  infiniteModelName: "assessment",
  infiniteContainerName:"employeeAssessmentContainer",
  stopScroll: true,
  queryFlagInFlag: 0,
  constants:Constants,
  date:Ember.computed(function(){
    console.log('date in employee-assessment:',this.get('dateService').timestampToTime(this.get('dataLoader').getNowTime()));
    return this.get('dateService').timestampToTime(this.get('dataLoader').getNowTime());
  }),
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
          examiner:{id:employeeId},
      };
    }
    //时间搜索，拼接filter
    if(this.get("global_curStatus.assessmentTimeSearchFlag")&&this.get('global_curStatus.timeSearch')){
      console.log('111111111111');
      this.set('oldEmployeeId',employeeId);
      let firstSecond = this.get('global_curStatus.searchTimeFirst');
      let lastSecond = this.get('global_curStatus.searchTimeLast');
      filter = $.extend({}, filter, {'examTime@$gte':firstSecond,'examTime@$lte':lastSecond});
    }


    let sort = {
      examTime:"desc",
    };
    params.filter = filter;
    params.sort = sort;
    console.log("params:",params);
    console.log('oldEmployeeId',this.get('oldEmployeeId'));
    _self.get("feedBus").set("assessmentFlag",false);
    this.infiniteQuery('assessment',params);
    this.set('global_curStatus.timeSearch',true);
  }.observes("attendanceEmployeeId","delFlag","global_curStatus.assessmentTimeSearchFlag").on("init"),

//只有当当前页面时route是service-care时,才会把切换以后的老人id传递给组件,使其加载数据
  attendanceEmployeeIdObs: function(){
    var employeeId = this.get("global_curStatus.attendanceEmployeeId");
    var curRoutePath=this.get('global_pageConstructure').get('curRouteName');
    if(curRoutePath === "employee-assessment"){
      this.set("attendanceEmployeeId",employeeId);
    }
  }.observes("global_curStatus.attendanceEmployeeId").on("init"),


  actions:{
    invitation(){
      this.set('addNewAssessment',false);
    },
    delAction(){
      this.incrementProperty('delFlag');
    },
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
          _self.set('addNewAssessment',true);
        },100);
      },200);
    },
    saveNewAssessment(){
      var _self = this;
      var employeeId = this.get("employeeId");
      let assessmentType = this.get("dataLoader").findDict(Constants.assessmentType2);
      let employee = _self.get("global_curStatus").get("attendanceEmployee");
      let curuser = this.get('global_curStatus').getUser();
      let time = this.get('date');
      time = this.get('dateService').timeStringToTimestamp(time);
      let assessmentInfo = _self.store.createRecord('assessment',{examiner:employee,examOfficerUser:curuser,type:assessmentType,examTime:time});
      console.log('new assessment ',assessmentInfo,time);
      this.set('addNewAssessment',false);
      assessmentInfo.save().then(function(assessment){
        let assessmentIndicatorResultList = assessment.get("results");
        if(assessmentIndicatorResultList.get("length")){
          console.log("run in length");
          App.lookup("controller:business").popTorMsg("该天考核数据已存在");
        }
        var params = {};
        params= {itemId:assessment.get('id'),source:"look",itemIdFlag:Math.random()};
        var mainpageController = App.lookup('controller:business.mainpage');
        _self.get("feedBus").set("assessmentData",assessment);
        mainpageController.switchMainPage('employee-assessment-detail',params);
        _self.set('date',null);
      });
      // var params = {
      //   itemIdFlag:Math.random(),
      //   itemId:employeeId,
      //   source:'add'
      // };
      // var mainpageController = App.lookup('controller:business.mainpage');
      // mainpageController.switchMainPage('employee-assessment-detail',params);
    },
    switchShowAction(){
      this.directInitScoll();
      //当第一次进入页面时,才把全部选好的老人id传给组件
      var employeeId = this.get("global_curStatus.attendanceEmployeeId");
      this.set("attendanceEmployeeId",employeeId);
      let assessmentFlag = this.get("feedBus").get("assessmentFlag");
      this.set('global_curStatus.searchTimeFirst',null);
      this.set('global_curStatus.searchTimeLast',null);
      this.set("global_curStatus.assessmentTimeSearchFlag",0);
      if(assessmentFlag){
        this.customerObs();
      }
    },


  },

});
