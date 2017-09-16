import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"customerWarningDetailContainer",
  preventInfinite: true,
  customerListFlag: 0,
  constants:Constants,

  uploadUrl: Ember.computed(function() {return this.get("pathConfiger").get("uploadUrl");}),

  warningItem:Ember.computed("itemId","itemIdFlag",function(){
    //从全局上下文服务里拿到外层传递的数据
    let warningItem = this.get("feedBus").get("serviceData");
    console.log("customerwarningItemThe computed:",warningItem);
    this.get("feedBus").set("serviceData",null);//重置feedbus数据
  //与传参进行比较，一致才设置
    if(warningItem.get("id")===this.get("itemId")){
      return warningItem;
    }
  }),

  actions:{
    switchShowAction(){
    },
    saveDetail(){
      let _self = this;
      var itemId = "detail_warning";
      let operateNote = this.get('operateNote');
      let curUser = this.get('global_curStatus').getUser();
      let curEmployee = curUser.get('employee');
      var warningItem = this.get("warningItem");
      let sysTime = _self.get("dataLoader").getNowTime();
      console.log("sysTime in save:",sysTime);
      var flagObj = this.get("dataLoader").findDict(Constants.hbeaconWarningCancelByHand);
      warningItem.set("operateNote",operateNote);
      warningItem.set("operateTime",sysTime);
      warningItem.set("operater",curEmployee);
      warningItem.set("flag",flagObj);
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          //保存数据
          warningItem.save().then(function() {
            App.lookup("controller:business").popTorMsg("操作成功");
            warningItem.set("hasApply",true);
            _self.get("feedBus").set("serviceData",warningItem);
            var customerListFlag = _self.get("customerListFlag");
            _self.incrementProperty("customerListFlag");
            _self.set("operateNote","");
            var params = {
              customerListFlag:customerListFlag
            };
            App.lookup('controller:business.mainpage').switchMainPage('customer-warning',params);
          }, function(err) {
              console.log("save err!");
              console.log("err:",err);
              let error = err.errors[0];
              if (error.code === "15") {
                App.lookup("controller:business").popTorMsg("操作失败,此预警已经处理!");
              }
          });

        },100);
      },200);
    },

  }
});
