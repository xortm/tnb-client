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
  infiniteContainerName:"customerHobbyDetailContainer",
  stopScroll: true,//阻止下拉刷新的所有操作
  customerListFlag: 0,
  refreshFlag: 0,
  constants:Constants,

  customerInfoObs:function(){
    var _self = this;
    _self._showLoading();
    var id = this.get("id");
    console.log("id:",id);
    var itemIdFlag = this.get("itemIdFlag");
    var source = this.get("source");
    console.log("itemIdFlag:",itemIdFlag);
    if(!id||!itemIdFlag){return;}
    if(source == "add"){
      let customer = _self.store.peekRecord('customer',id);
      console.log("customer:",customer);
      let customerInfo = _self.get('store').createRecord('customer-preference',{
          customer: customer,
      });
      this.set("customerInfo",customerInfo);
      _self.hideAllLoading();
      _self.directInitScoll(true);
      return;
    }
    //从全局上下文服务里拿到外层传递的数据
    let customerItem = _self.get("feedBus").get("hobbyData");
    console.log("employeecustomerDetailContainer computed:",customerItem);
    //与传参进行比较，一致才设置
    if(customerItem.get("id") === id||!customerItem.get("id")){
      _self.set("customerInfo",customerItem);
      _self.hideAllLoading();
      _self.directInitScoll(true);
    }
  }.observes("itemIdFlag"),
  actions:{
    addDetail(){
      let _self = this;
      var itemId = "customerHobbyAddDetail";
      let customerInfo = this.get("customerInfo");
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          App.lookup('controller:business.mainpage').showMobileLoading();
          let refreshFlag = _self.get("refreshFlag");
          _self.incrementProperty("refreshFlag");
          let params = {
            refreshFlag:refreshFlag
          };
          customerInfo.save().then(function(customer){
            _self.get("mainController").switchMainPage('customer-point',params);
            App.lookup("controller:business").popTorMsg("添加成功!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
          }, function(err) {
            App.lookup("controller:business").popTorMsg("添加失败!");
            console.log("save err!");
            console.log("err:",err);
            // let error = err.errors[0];
            // if (error.code === "99") {
            // }
          });
        },100);
      },200);
    },
    saveDetail(){
      let _self = this;
      var itemId = "customerHobbyDetail";
      let customerInfo = _self.get("customerInfo");
      console.log("customerInfo:",_self.get("customerInfo"));
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          App.lookup('controller:business.mainpage').showMobileLoading();
          // let refreshFlag = _self.get("refreshFlag");
          // _self.incrementProperty("refreshFlag");
          // let params = {
          //   refreshFlag:refreshFlag
          // };
          customerInfo.save().then(function(customer){
            _self.get("mainController").switchMainPage('customer-point');
            App.lookup("controller:business").popTorMsg("保存成功!");
            App.lookup('controller:business.mainpage').closeMobileLoading();
          }, function(err) {
            App.lookup("controller:business").popTorMsg("保存失败!");
            console.log("save err!");
            console.log("err:",err);
            // let error = err.errors[0];
            // if (error.code === "99") {
            // }
          });
        },100);
      },200);
    },
    deleteDetail(){
      let _self = this;
      var itemId = "customerHobbyDeleteDetail";
      let customerInfo = _self.get("customerInfo");
      console.log("customerInfo:",_self.get("customerInfo"));
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          App.lookup('controller:business.mainpage').showMobileLoading();
          let refreshFlag = _self.get("refreshFlag");
          _self.incrementProperty("refreshFlag");
          let params = {
            refreshFlag:refreshFlag
          };
          var flag = _self.get("flag");
          if(flag == "preference"){
            customerInfo.set("delStatus", 1);
            customerInfo.save().then(function(customer){
              _self.get("mainController").switchMainPage('customer-point',params);
              App.lookup("controller:business").popTorMsg("删除成功!");
              App.lookup('controller:business.mainpage').closeMobileLoading();
            }, function(err) {
              App.lookup("controller:business").popTorMsg("删除失败!");
              console.log("save err!");
              console.log("err:",err);
              // let error = err.errors[0];
              // if (error.code === "99") {
              // }
            });
          }else{
            console.log("flag in del:",flag);
            customerInfo.set(flag, "");
            customerInfo.save().then(function(customer){
              _self.get("mainController").switchMainPage('customer-point',params);
              App.lookup("controller:business").popTorMsg("删除成功!");
              App.lookup('controller:business.mainpage').closeMobileLoading();
            }, function(err) {
              App.lookup("controller:business").popTorMsg("删除失败!");
              console.log("save err!");
              console.log("err:",err);
              // let error = err.errors[0];
              // if (error.code === "99") {
              // }
            });

          }
        },100);
      },200);
    },

    switchShowAction(){
    },
    switchBackAction(){
      this.get("customerInfo").rollbackAttributes();
    },

  }
});
