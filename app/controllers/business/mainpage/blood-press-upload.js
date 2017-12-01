import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userBloodPressUploadContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  dateService: Ember.inject.service("date-service"),
  constants:Constants,

  queryFlagIn: function(){
    this.hideAllLoading();
  },
  init:function(){
    this.hideAllLoading();
  },

  actions:{
    switchShowAction(){
      console.log("in switchShowAction");
      //  清空页面的input输入框
      this.set('highValue', "");
      this.set('lowValue', "");
      this.set("date","");
    },
    dpShowAction(e) {

    },
    changeDateAction(date) {
        console.log('customerinfo is date', date);
        //var stamp = this.get("dateService").getLastSecondStampOfDay(date);
        var stamp = this.get("dateService").timeToTimestamp(date);
        console.log("stamp 111", stamp);
        this.set("timeStamp", stamp);
    },
    saveItem:function(){
      let date = this.get("date");//体检时间
      let sysTime = this.get("dataLoader").getNowTime();
      let nowDay = this.get("dateService").formatDate(sysTime,"yyyy-MM-dd");
      date = nowDay+" "+date+":00";
      date = date.replace(/-/g,'/');
      var timeStamp = new Date(date).getTime()/1000;
      console.log("11111111111date",timeStamp);
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var curUser = this.get("statusService").getUserReal();//获取居家curUser
      let _self = this;
      var highValue = this.get('highValue');
      console.log("highValue",highValue);
      var lowValue = this.get('lowValue');
      console.log("lowValue",lowValue);
      // var timeStamp = this.get("timeStamp");
      // console.log("timeStamp",timeStamp);
      if ('undefined' === typeof(highValue) || '' === highValue) {
        App.lookup("controller:business").popTorMsg("最高血压值不能为空!");
          return ;
      }
      if ('undefined' === typeof(lowValue) || '' === lowValue) {
        App.lookup("controller:business").popTorMsg("最低血压值不能为空!");
          return ;
      }
      if ('undefined' === typeof(timeStamp) || '' === timeStamp ||!timeStamp) {
        App.lookup("controller:business").popTorMsg("日期不能为空!");
        return ;
      }
      var typeObj = this.get("dataLoader").findDict(Constants.healthExamType1);
      console.log("typeObj is", typeObj);
      var healthInfo = _self.store.createRecord('health-info', {
        itemtype:typeObj,
        result:highValue,
        resultAddtion:lowValue,
        examDateTime:timeStamp,
        examUser:curCustomer,
        createUser:curUser,
      });
      healthInfo.save().then(function(){
        App.lookup("controller:business").popTorMsg("血压上传成功!");
        App.lookup('controller:business.mainpage').switchMainPage('blood-press');
      });
    },

  },

});
