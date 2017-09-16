import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userMedicationUploadContainer",

  moment: Ember.inject.service(),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  dataLoader: Ember.inject.service("data-loader"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,

  queryFlagIn: function(){return;},

  actions:{
    saveItem:function(){
      var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
      var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
      let _self = this;
      let isTaken = document.getElementById("isTaken").value;
      console.log("isTaken",isTaken);
      let isInTime = document.getElementById("isInTime").value;
      console.log("isInTime",isInTime);
      if(isTaken == "0" && isInTime == "1"){
        document.getElementById("isInTime").value = "0";
        isInTime = "0";
        //App.lookup("controller:business").popTorMsg("由于您忘记吃药，我们已将是否按时吃药设置为“没按时”");
        //return ;
      }
      this.store.findRecord('customer',curCustomerId).then(function(customer){
        var drugRecord = _self.store.createRecord('drugRecord', {
          isTaken:isTaken,
          isInTime:isInTime,
          customer:customer,
        });
        //drugRecord.set("createTime",createTime);
        drugRecord.save().then(function(){
          App.lookup("controller:business").popTorMsg("用药上传成功!");
          App.lookup('controller:business.mainpage').switchMainPage('healthy-plan-medication');
        });
      });
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
    // getIsTakenVal:function(){
    //   let isTaken = document.getElementById("isTaken").value;
    //   this.set("isTaken",isTaken);
    //   console.log("isTaken",isTaken);
    // },
    // getIsInTimeVal:function(){
    //   let isInTime = document.getElementById("isInTime").value;
    //   this.set("isInTime",isInTime);
    //   console.log("isInTime",isInTime);
    // },

  },

});
