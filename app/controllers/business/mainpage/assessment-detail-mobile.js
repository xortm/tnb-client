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

  assessmentInfoObs:function(){
    var _self = this;
    _self._showLoading();
    var assessmentId = this.get("assessmentId");
    console.log("assessmentId:",assessmentId);
    var itemIdFlag = this.get("itemIdFlag");
    console.log("itemIdFlag:",itemIdFlag);
    if(!assessmentId||!itemIdFlag){return;}
    //从全局上下文服务里拿到外层传递的数据
    let assessmentItem = _self.get("feedBus").get("assessmentData");
    console.log("employeeAssessmentDetailContainer computed:",assessmentItem);
    //与传参进行比较，一致才设置
    if(assessmentItem.get("id") === assessmentId){
      _self.set("assessmentInfo",assessmentItem);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    }
  }.observes("itemIdFlag"),
  actions:{
    saveDetail(){
      let _self = this;
      let assessmentInfo = this.get("assessmentInfo");
      console.log("assessmentInfo:",this.get("assessmentInfo"));
      let assessmentInfoRemark = assessmentInfo.get("remark");
      assessmentInfo.set("point",null);
      _self.get("mainController").switchMainPage('employee-assessment-detail');
      assessmentInfo.save().then(function(assessment){
        App.lookup("controller:business").popTorMsg("考核项信息修改完成!");
        _self.get("feedBus").set("assessmentFlag",true);
      }, function(err) {
        resultsItem.set("remark",assessmentInfoRemark);
        App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
        console.log("save err!");
        console.log("err:",err);
        // let error = err.errors[0];
        // if (error.code === "99") {
        // }
      });
    },

    switchShowAction(){
    },

  }
});
