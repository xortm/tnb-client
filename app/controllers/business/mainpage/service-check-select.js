import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedBus: Ember.inject.service("feed-bus"),
  dataLoader: Ember.inject.service("data-loader"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"fullSelectContainer",
  scrollPrevent:true,
  constants:Constants,

  resultsItem:Ember.computed("assessmentIndicatorId",function(){
    //从全局上下文服务里拿到外层传递的数据
    let resultsItem = this.get("feedBus").get("assessmentResultData");
    console.log("fullSelectContainer computed:",resultsItem);
  //与传参进行比较，一致才设置
    if(resultsItem.get("assessmentIndicator.id")===this.get("assessmentIndicatorId")){
      console.log('resultsItem id ',resultsItem.get("assessmentIndicator.id"),this.get("assessmentIndicatorId"));
      return resultsItem;
    }
    return null;
  }),
  typeAndRemarkObs:function(){
    let strType = this.get('strType');
      console.log('strType',strType);
      if(strType=='remark'){
        this.set('remarkType',true);
        this.set('serviceCheckItem',false);
      }
      if(strType=='serviceCheckItem'){
        this.set('serviceCheckItem',true);
        this.set('remarkType',false);
      }
  }.observes('strType').on('init'),
  serviceCheckItemList:Ember.computed(function(){
    let _self = this;
    let serviceCheckItemList = _self.get("dataLoader").findDictList(Constants.serviceItem); //字典数组
    console.log("serviceCheckItemList:",serviceCheckItemList);
    return serviceCheckItemList;
  }),
  serviceCheckInfoObs:function(){
    let serviceCheckId = this.get('serviceCheckId');
    if(serviceCheckId){
      let serviceCheckInfo = this.store.peekRecord('servicecheck',serviceCheckId);
      this.set('serviceCheckInfo',serviceCheckInfo);
    }
  }.observes('serviceCheckId').on('init'),
  actions:{
    chooseType(serviceCheckItem,index){
      let serviceCheckInfo = this.store.peekRecord('servicecheck',this.get('serviceCheckId'));
      serviceCheckInfo.set('item',serviceCheckItem);
      let _self = this;
      let itemId = "#choose-type-" + index;
      $(itemId).addClass("tapped");
      Ember.run.later(function(){
        $(itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainController = App.lookup("controller:business.mainpage");
          mainController.switchMainPage("service-check-detail-mobile");
          serviceCheckInfo.save().then(function(){
            App.lookup("controller:business").popTorMsg("检查内容修改完成!");
            _self.get("feedBus").set("serviceCheckFlag",true);
          }, function(err) {
            console.log("save err!");
            console.log("err:",err);
            App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
          });
        },100);
      },200);
    },
    saveDetail(){
      let serviceCheckInfo = this.get('serviceCheckInfo');
      let _self = this;
      var mainController = App.lookup("controller:business.mainpage");
      mainController.switchMainPage("service-check-detail-mobile");
      serviceCheckInfo.save().then(function(){
        App.lookup("controller:business").popTorMsg("检查结果修改完成!");
        _self.get("feedBus").set("serviceCheckFlag",true);
      }, function(err) {
        App.lookup("controller:business").popTorMsg("保存失败,您操作过于频繁!");
      });
    },
    switchShowAction(){
      this.directInitScoll(true);
    },

  },

});
