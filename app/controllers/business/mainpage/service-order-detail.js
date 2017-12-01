import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  dateService:Ember.inject.service('date-service'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"serviceOrderDetailContainer",
  scrollPrevent: true,
  constants:Constants,

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

  actions: {
    // cancelServiceOrder(){
    //   var _self = this;
    //   var itemId = "serviceOrderCancelBut";
    //   let nursingplandetailModel = this.get("nursingplandetailModel");
    //   let serviceItemId = this.get("itemId");
    //
    //   this.set("nursingplandetailModel.serviceTime",time);
    //   this.set("nursingplandetailModel.remark",serviceItemId);
    //   _self.get('global_ajaxCall').set('action','jujia');
    //   $("." + itemId).addClass("tapped");
    //   Ember.run.later(function(){
    //     $("." + itemId).removeClass("tapped");
    //     Ember.run.later(function(){
    //       nursingplandetailModel.save().then(function(nursingplandetail){
    //         App.lookup("controller:business").popTorMsg("下单成功");
    //         var mainpageController = App.lookup('controller:business.mainpage');
    //         mainpageController.switchMainPage('service-order-list');
    //       });
    //     },100);
    //   },200);
    // },


  },

});
