import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"healthyFileImplementContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  init: function(){
    this.queryFlagIn();
  },
  queryFlagIn: function(){
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
     var _self = this;
    _self.store.query("executionReport",{
      filter:{customer:{id:curCustomerId}},
      sort:{createTime:"desc"}
    }).then(function(executionReportList){
      if(!executionReportList&&executionReportList.get("length")===0){
        _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
      }
      console.log("executionReportList",executionReportList);
      let executionReport = executionReportList.get("firstObject");
      console.log("executionReport",executionReport);
      _self.set("executionReport",executionReport);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    });
  },
  checkScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('checkScore');
    var checkScore = {};
    checkScore.num = num;
    var list = [0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    checkScore.list = list;
    var status;
    switch (num)
    {
    case 0:
      status="很差";
      break;
    case 1:
      status="较差";
      break;
    case 2:
      status="一般";
      break;
    case 3:
      status="一般";
      break;
    case 4:
      status="良好";
      break;
    case 5:
      status="很好";
      break;
    }
    checkScore.status = status;
    return checkScore;
  }),
  mealScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('mealScore');
    var mealScore = {};
    mealScore.num = num;
    var list = [0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    mealScore.list = list;
    var status;
    switch (num)
    {
      case 0:
        status="很差";
        break;
      case 1:
        status="较差";
        break;
      case 2:
        status="一般";
        break;
      case 3:
        status="一般";
        break;
      case 4:
        status="良好";
        break;
      case 5:
        status="很好";
        break;
    }
    mealScore.status = status;
    return mealScore;
  }),
  sportScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('sportScore');
    var sportScore = {};
    sportScore.num = num;
    var list = [0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    sportScore.list = list;
    var status;
    switch (num)
    {
      case 0:
        status="很差";
        break;
      case 1:
        status="较差";
        break;
      case 2:
        status="一般";
        break;
      case 3:
        status="一般";
        break;
      case 4:
        status="良好";
        break;
      case 5:
        status="很好";
        break;
    }
    sportScore.status = status;
    return sportScore;
  }),
  medicationScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('medicationScore');
    var medicationScore = {};
    medicationScore.num = num;
    var list = [0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    medicationScore.list = list;
    var status;
    switch (num)
    {
      case 0:
        status="很差";
        break;
      case 1:
        status="较差";
        break;
      case 2:
        status="一般";
        break;
      case 3:
        status="一般";
        break;
      case 4:
        status="良好";
        break;
      case 5:
        status="很好";
        break;
    }
    medicationScore.status = status;
    return medicationScore;
  }),
  recoveryScoreObject:Ember.computed('executionReport',function(){
    if(!this.get('executionReport')){
      return null;
    }
    var num = this.get('executionReport').get('recoveryScore');
    var recoveryScore = {};
    recoveryScore.num = num;
    var list = [0,0,0,0,0];
    for (var i = 0; i < num; i++) {
      list[i] = true;
    }
    recoveryScore.list = list;
    var status;
    switch (num)
    {
      case 0:
        status="很差";
        break;
      case 1:
        status="较差";
        break;
      case 2:
        status="一般";
        break;
      case 3:
        status="一般";
        break;
      case 4:
        status="良好";
        break;
      case 5:
        status="很好";
        break;
    }
    recoveryScore.status = status;
    return recoveryScore;
  }),

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
