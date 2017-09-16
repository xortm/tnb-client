import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const { taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "customerList",
  infiniteModelName: "customer",
  infiniteContainerName:"customerContainer",
  curTabCode:"user",

  tabFuncs:Ember.computed(function() {
   var a = new Ember.A();
   var t1 = Ember.Object.create({
     code:"user",
     selected: true,
     text:"长者信息"
   });
   var t2 = Ember.Object.create({
     code:"checkIn",
     text:"入住信息"
   });
   var t3 = Ember.Object.create({
     code:"healthy",
     text:"健康信息"
   });
   a.pushObject(t1);
   a.pushObject(t2);
   a.pushObject(t3);
   return a;
 }),

 init: function(){
   var _self = this;
   Ember.run.schedule("afterRender",this,function() {
     _self.set("clickActFlag","user");
   });
 },

 customerObs: function(){
   var _self = this;
   console.log("QQQQQ",_self.get('id'));
   this.get("store").findRecord('customer',_self.get('id')).then(function(customer){
     _self.set("customer",customer);
  //  var customerInfo=_self.get("store").peekRecord('customer',_self.get('id'));
  //  _self.set("customerInfo",customerInfo);
   });
   this.get("store").findRecord('customer',_self.get('id')).then(function(customerInfo){
     _self.set("customerInfo",customerInfo);
   });
 },

  actions:{
    switchTab(code){
      //console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
    },
    goDetail(){
      //console.log("go detail");
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('customer-info');
    },
    csItemDetail(){
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('customer-service-detail');
    },
 }
});
