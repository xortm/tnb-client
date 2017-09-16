import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service('date-service'),
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  mainController: Ember.inject.controller('business.mainpage'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"employeeAssessmentDetailContainer",
  preventInfinite: true,
  customerListFlag: 0,
  constants:Constants,
  showAssessment:true, //显示添加时间
  assessmentIndicatorLoad:0, //加载完成标志
  // afterSaveFlag:false, //新建标志
  // showLoadingImg:false, //刚进页面不要加载标志

  init: function(){
    var _self = this;
    _self._showLoading();
    Ember.run.schedule("afterRender",this,function() {
      let selector = $("#assessmentTypeSelector");
      console.log("selector is",selector);
      selector.comboSelect({focusInput:false});
    });
    this.store.query('assessment-indicator',{filter:{level:0}}).then(function(assessmentIndicatorList){
      _self.set('assessmentIndicatorList',assessmentIndicatorList);
      console.log('assessmentIndicatorList',assessmentIndicatorList);
      _self.incrementProperty('assessmentIndicatorLoad');
    });
    this.store.findRecord('user',this.get('global_curStatus').getUser().get("id")).then(function(user){
      _self.set('user',user);
      console.log('user',user);
      _self.incrementProperty('assessmentIndicatorLoad');
    });
  },
  assessmentTypeList:Ember.computed(function(){
    let _self = this;
    let assessmentTypeList = _self.get("dataLoader").findDictList(Constants.assessmentType); //字典数组
    console.log("assessmentTypeList:",assessmentTypeList);
    return assessmentTypeList;
  }),
  assessmentInfoObs:function(){
    var _self = this;
    _self._showLoading();
    var assessmentIndicatorLoad = this.get("assessmentIndicatorLoad");
    if(assessmentIndicatorLoad < 2){return;}
    var itemId = this.get("itemId");
    console.log("itemId:",itemId);
    var itemIdFlag = this.get("itemIdFlag");
    console.log("itemIdFlag:",itemIdFlag);
    var source = this.get("source");
    console.log("source:",source);
    if(!itemId||!source||!itemIdFlag){return;}
    let employee = _self.get("global_curStatus").get("attendanceEmployee");
    _self.set("employee",employee);
    console.log("employee:",employee);
    if(source === "add"){
      _self.set("showAssessment",true);
      //默认选中日常考核
      let assessmentType = this.get("assessmentTypeList").findBy("typecode",Constants.assessmentType2);
      console.log("assessmentType in typename add:",assessmentType);
      this.set('theTypecode',assessmentType.get("typecode"));
      this.set('itemtypeObj',assessmentType);
      // this.set('assessmentInfo.type',assessmentType);
      let curuser = _self.get('user');
      let employee = _self.get("employee");
      // let curuser = _self.get("global_curStatus").get('user');
      console.log("curuser:",curuser);
      let assessmentInfo = _self.store.createRecord('assessment',{examiner:employee,examOfficerUser:curuser,type:assessmentType});
      _self.set("assessmentInfo",assessmentInfo);
      console.log("healthInfo11111",assessmentInfo);
      Ember.run.schedule("afterRender",this,function() {
        let selector = $("#assessmentTypeSelector");
        console.log("selector is",selector);
        selector.comboSelect({focusInput:false});
      });
      _self.hideAllLoading();
      _self.directInitScoll(true);
    }else if(source === "look"){
      _self.set("showAssessment",false);
      //从全局上下文服务里拿到外层传递的数据
      let assessmentItem = _self.get("feedBus").get("assessmentData");
      // let afterSaveFlag = _self.get("afterSaveFlag");
      // if(afterSaveFlag){
      //   assessmentItem = _self.get("assessmentItem");
      // }
      console.log("employeeAssessmentDetailContainer computed:",assessmentItem);
      //与传参进行比较，一致才设置
      if(assessmentItem.get("id") === itemId){
        _self.set("assessment",assessmentItem);
        let assessmentIndicatorResultList = assessmentItem.get("results");
        let assessmentResults = new Ember.A();
        let assessmentIndicatorList = _self.get("assessmentIndicatorList");
        console.log("assessmentIndicatorList in obs:",assessmentIndicatorList);
        assessmentIndicatorList.forEach(function(assessmentIndicator){
          let hasItem = assessmentIndicatorResultList.findBy("assessmentIndicator.id",assessmentIndicator.get("id"));
          if(!hasItem){
            let assessmentIndicatorResult = _self.store.createRecord('assessmentIndicatorResult',{assessment:assessmentItem,assessmentIndicator:assessmentIndicator,score:0});
            assessmentResults.pushObject(assessmentIndicatorResult);
          }else{
            assessmentResults.pushObject(hasItem);
          }
        });
        _self.set("assessmentResults",assessmentResults);
        _self.hideAllLoading();
        _self.directInitScoll(true);
      }
    }
  }.observes("itemIdFlag","itemId","source","assessmentIndicatorLoad"),

  mobileAlertMess: function(text) {
    var _self = this;
    this.set('responseInfo',text);
    this.set('theTextOfModel',true);
    setTimeout(()=>{
      _self.set("theTextOfModel", false);
    },2000);
  },

  actions:{
    typeName:function(code){
       let assessmentType = this.get("assessmentTypeList").findBy("typecode",code);
       console.log("assessmentType in typename:",assessmentType);
       this.set('assessmentInfo.type',assessmentType);
       this.set('theTypecode',assessmentType.get("typecode"));
       this.set('itemtypeObj',assessmentType);
     },
    saveDetail(){
      let _self = this;
      var itemId = "assessmentBut";
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          let $FromDate = $("#assessmentFromDate");
          let date = $FromDate.val();
          let examTime = new Date(date).getTime()/1000;
          console.log("11111111111date",examTime);
          let theTypecode = _self.get("theTypecode");
          if(!examTime){
            _self.mobileAlertMess('考核时间不能为空');
            return;
          }else if(!theTypecode){
            _self.mobileAlertMess('考核类型不能为空');
            return;
          }
          _self.set('assessmentInfo.examTime',examTime);
          let assessmentInfo = _self.get("assessmentInfo");
          console.log("assessmentInfo:",_self.get("assessmentInfo"));
          // _self.set("showLoadingImg",true);
          assessmentInfo.save().then(function(assessment){
            console.log("assessment:",assessment);
            let examTimeStr = _self.get("dateService").formatDate(assessment.get("examTime"),"yyyy-MM-dd");
            assessment.set("examTimeStr",examTimeStr);
            console.log("assessment after:",assessment);
            let assessmentIndicatorResultList = assessment.get("results");
            console.log("assessmentIndicatorResultList:",assessmentIndicatorResultList);
            console.log("assessmentIndicatorResultList length:",assessmentIndicatorResultList.get("length"));
            if(assessmentIndicatorResultList.get("length")){
              console.log("run in length");
              App.lookup("controller:business").popTorMsg("该天考核数据已存在");
            }
            // _self.set("afterSaveFlag",true);
            // _self.set("assessmentItem",assessment);
            _self.get("feedBus").set("assessmentData",assessment);
            _self.get("feedBus").set("assessmentFlag",true);
            _self.set("itemId",assessment.get("id"));
            _self.set("source","look");
            // _self.set("showLoadingImg",false);
            _self.incrementProperty('assessmentIndicatorLoad');
            _self.set("showAssessment",false);
          }, function(err) {
            console.log("save err!");
            console.log("err:",err);
            App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
            // let error = err.errors[0];
            // if (error.code === "15") {
            //   App.lookup("controller:business").popTorMsg("该天考核已存在!");
            // }
          });
        },100);
      },200);
    },
    //跳转选择 self-choose
    toSelfChoose:function (maxScore,name,elementId,assessmentResult,index) {
      var params = {maxScore:maxScore,name:name,assessmentIndicatorId:elementId};
      var _self = this;
      var itemId = "indicator_" + index;
      console.log("itemId in to:",itemId);
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          //通过全局服务进行上下文传值
          console.log("assessmentResult in list:",assessmentResult);
          _self.get("feedBus").set("assessmentResultData",assessmentResult);
          _self.get("mainController").switchMainPage('full-select',params);
        },100);
      },200);
    },

    gotoAssessmentDetail(){
      console.log("go assessment detail");
      var _self = this;
      var params = {};
      params= {assessmentId:_self.get("assessment.id"),itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      var itemId = "assessment_detail_" + this.get("assessment.id");
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          //通过全局服务进行上下文传值
          console.log("assessment in list:",_self.get("assessment"));
          _self.get("feedBus").set("serviceData",_self.get("assessment"));
          mainpageController.switchMainPage('assessment-detail-mobile',params);
        },100);
      },200);
    },

    switchShowAction(){
      $("#assessmentTypeSelector").val("1");
      $("#assessmentTypeSelector .combo-input").val("");
      $("#assessmentFromDate").val("");
    },

  }
});
