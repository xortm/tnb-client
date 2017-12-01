import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedBus: Ember.inject.service("feed-bus"),
  dataLoader: Ember.inject.service("data-loader"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"dispatchEmployeeSelectContainer",
  scrollPrevent:true,
  constants:Constants,
  employeeList:Ember.computed(function(){
    let employeeList = this.get("dataLoader").get("employeeSelecter");
    return employeeList;
  }),
  //初始化数据
  serviceItemObs:function(){
    this._showLoading();
    let itemIdFlag = this.get("itemIdFlag");
    if(!itemIdFlag){return;}
    //从全局上下文服务里拿到外层传递的数据
    let itemData = this.get("feedBus").get("serviceOrderLookData");
    console.log("itemData computed:",itemData);
    let itemDataId = itemData.get("id");
    console.log('itemDataId',itemDataId);
    if(itemDataId==this.get("itemId")){
      this.set("itemData",itemData);
      this.hideAllLoading();
    }
  }.observes("itemIdFlag"),
  assessmentTypeList:Ember.computed(function(){
    let _self = this;
    let assessmentTypeList = _self.get("dataLoader").findDictList(Constants.assessmentType); //字典数组
    console.log("assessmentTypeList:",assessmentTypeList);
    return assessmentTypeList;
  }),
  actions:{
    invitation(){
      this.set('showConfirm',false);
    },
    confirmEmployee:function(employeeId){
      let itemId = "employee_" + employeeId;
      let _self = this;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          let employee = _self.get("employeeList").findBy("id",employeeId);
          console.log("employee obj:",employee);
          _self.set("showConfirm",true);
          _self.set("employee",employee);
        },100);
      },200);
    },
    chooseEmployee:function(){
      let _self = this;
      _self.set('showConfirm',false);
      let itemData = this.get("itemData");
      let employee = this.get("employee");
      let serviceStatusObj = this.get("dataLoader").findDict(_self.get('constants').jujiaServiceStatus2);
      console.log("itemData",itemData);
      console.log("employee",employee);
      console.log("serviceStatusObj",serviceStatusObj);
      itemData.set("serviceOperater",employee);
      itemData.set("serviceStatus",serviceStatusObj);
      App.lookup('controller:business.mainpage').showMobileLoading();
      var mainController = App.lookup("controller:business.mainpage");
      itemData.save().then(function(){
        App.lookup('controller:business.mainpage').closeMobileLoading();
        App.lookup("controller:business").popTorMsg("派单完成!");
        mainController.switchMainPage("service-order-dispatch");
      }, function(err) {
        console.log("save err!");
        console.log("err:",err);
        App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
        App.lookup('controller:business.mainpage').closeMobileLoading();
      });
    },
    switchShowAction(){
      this.directInitScoll(true);
    },

  },

});
