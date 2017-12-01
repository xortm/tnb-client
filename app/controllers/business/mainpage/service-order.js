import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  feedBus: Ember.inject.service("feed-bus"),
  pathConfiger: Ember.inject.service("path-configer"),
  dateService:Ember.inject.service('date-service'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"serviceOrderContainer",
  scrollPrevent: true,
  constants:Constants,
  init: function(){
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      let selector = $("#serviceOrderSelector");
      console.log("selector is",selector);
      selector.comboSelect({focusInput:false});
    });
  },

  paymentTypeList:Ember.computed(function(){
    console.log("payType:",Constants.payType);
    let paymentTypeList = this.get("dataLoader").findDictList(Constants.payType);
    console.log("paymentTypeList:",paymentTypeList);
    return paymentTypeList;
  }),

  //初始化数据
  serviceItemObs:function(){
    this._showLoading();
    let itemIdFlag = this.get("itemIdFlag");
    if(!itemIdFlag){return;}
    //从全局上下文服务里拿到外层传递的数据
    let serviceOrderData = this.get("feedBus").get("serviceOrderData");
    console.log("serviceOrderData computed:",serviceOrderData);
    let serviceOrderDataId = serviceOrderData.get("id");
    console.log('serviceItemId',serviceOrderDataId);
    if(serviceOrderDataId==this.get("itemId")){
      this.set("serviceOrderData",serviceOrderData);
      let customer = this.get("dataLoader").get("staffcustomer").get("firstObject");
      console.log("customer in obs:",customer);
      let nursingplandetailModel = this.store.createRecord('nursingplandetail',{customer:customer});
      this.set("nursingplandetailModel",nursingplandetailModel);
      this.hideAllLoading();
    }
  }.observes("itemIdFlag"),

  showNoMessage:function(text){
    var _self = this;
    this.set("noMessageShow",true);
    this.set("noMessage",text);
    Ember.run.later(function(){
      _self.set("noMessageShow",false);
    },5000);
  },

  actions: {
    switchShowAction(){
      this.directInitScoll(true);
      console.log("run in switchShowAction");
      this.set("date",null);
      this.set("nursingplandetailModel.serviceTel",null);
      this.set("nursingplandetailModel.serviceAddress",null);
      this.set("nursingplandetailModel.paymentType",null);
      this.set("nursingplandetailModel.serviceTime",null);
      this.set("nursingplandetailModel.remark",null);
      $("#serviceOrderSelector").val("1");
      $("#serviceOrderContainer .combo-input").val("");
    },
    typeName:function(code){
      console.log("typeNameCode:",code);
       let paymentType = this.get("paymentTypeList").findBy("typecode",code);
       this.set('nursingplandetailModel.paymentType',paymentType);
     },
    saveServiceOrder(){
      var _self = this;
      var itemId = "serviceOrderBut";
      let nursingplandetailModel = this.get("nursingplandetailModel");
      let serviceItemId = this.get("itemId");
      let date = this.get('date');
      console.log("date in save:",date);
      console.log("paymentType in save:" + nursingplandetailModel.get("paymentType"));
      if(!date){
        _self.showNoMessage("预约时间不能为空");
        return;
      }
      if(!nursingplandetailModel.get("paymentType")){
        _self.showNoMessage("支付方式不能为空");
        return;
      }
      if(!nursingplandetailModel.get("serviceTel")){
        _self.showNoMessage("联系电话不能为空");
        return;
      }
      if(!nursingplandetailModel.get("serviceAddress")){
        _self.showNoMessage("地址不能为空");
        return;
      }
      let time = this.get('dateService').timeStringToTimestamp(date);
      this.set("nursingplandetailModel.serviceTime",time);
      this.set("nursingplandetailModel.remark",serviceItemId);
      _self.get('global_ajaxCall').set('action','jujia');
      $("." + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("." + itemId).removeClass("tapped");
        Ember.run.later(function(){
          nursingplandetailModel.save().then(function(nursingplandetail){
            App.lookup("controller:business").popTorMsg("下单成功");
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('service-order-list');
          });
        },100);
      },200);
    },




  },







});
