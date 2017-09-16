import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userBloodSugarUploadContainer",

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
      var curValue = this.get('curValue');
      console.log("curValue",curValue);
      // var timeStamp = this.get("timeStamp");
      // console.log("timeStamp",timeStamp);
      if ('undefined' === typeof(curValue) || '' === curValue) {
        App.lookup("controller:business").popTorMsg("血糖值不能为空!");
          return ;
      }
      if ('undefined' === typeof(timeStamp) || '' === timeStamp) {
        App.lookup("controller:business").popTorMsg("日期不能为空!");
          return ;
      }
      var typeObj = this.get("dataLoader").findDict(Constants.healthExamType7);
      console.log("typeObj is", typeObj);
      var healthInfo = _self.store.createRecord('health-info', {
        itemtype:typeObj,
        result:curValue,
        examDateTime:timeStamp,
        examUser:curCustomer,
        createUser:curUser,
      });
      healthInfo.save().then(function(){
        App.lookup("controller:business").popTorMsg("血糖上传成功!");
        App.lookup('controller:business.mainpage').switchMainPage('blood-sugar');
      });
      //  清空页面的input输入框
      this.set('curValue', "");
    },

  },

});
