import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userBloodPressUploadContainer",

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  dateService: Ember.inject.service("date-service"),
  constants:Constants,

  queryFlagIn: function(){return;},

  actions:{
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
      var date = this.get("date");
      console.log("11111111111date",date);
      var timeStamp = new Date(date).getTime()/1000;
      console.log("11111111111date",timeStamp);
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var curUser = this.get("statusService").getUser();//获取居家curUser
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
      if ('undefined' === typeof(timeStamp) || '' === timeStamp) {
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
      //  清空页面的input输入框
      this.set('highValue', "");
      this.set('lowValue', "");
    },

  },

});
