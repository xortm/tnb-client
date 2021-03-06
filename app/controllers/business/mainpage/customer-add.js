import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const { taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "customerList",
  infiniteModelName: "customer",
  infiniteContainerName:"customerContainer",
  curTabCode:"user",
  //图片点击事件参数
  informationParams:true,
  healthParams:false,
  serviceParams:false,
  recordParams:false,
  thingParams:false,
  //个人信息-点击参数
  infoParams:true,
  liveParams:false,
  pointParams:false,
  contactParams:false,
  healthInfoParams:false,
  clickFlag: 0, //标识(点击健康档案)
 //  tabFuncs:Ember.computed(function() {
 //   var a = new Ember.A();
 //   var t1 = Ember.Object.create({
 //     code:"user",
 //     selected: true,
 //     text:"长者信息"
 //   });
 //   var t2 = Ember.Object.create({
 //     code:"checkIn",
 //     text:"入住信息"
 //   });
 //   var t3 = Ember.Object.create({
 //     code:"healthy",
 //     text:"健康信息"
 //   });
 //   a.pushObject(t1);
 //   a.pushObject(t2);
 //   a.pushObject(t3);
 //   return a;
 // }),

 init: function(){
   var _self = this;
   Ember.run.schedule("afterRender",this,function() {
     _self.set("clickActFlag","user");
   });
 },

 customerObs: function(){
   var _self = this;
  //  console.log("QQQQQ",_self.get('id'));
  //  this.get("store").findRecord('customer',_self.get('id')).then(function(customer){
  //    _self.set("customer",customer);
  //  });
  //  this.get("store").findRecord('customer',_self.get('id')).then(function(customerInfo){
  //    _self.set("customerInfo",customerInfo);
  //  });
 },
  actions:{
    switchTab(code){
      this.set("curTabCode",code);
    },
    // goDetail(){
    //   var mainpageController = App.lookup('controller:business.mainpage');
    //   mainpageController.switchMainPage('customer-info');
    // },
    // csItemDetail(){
    //   var mainpageController = App.lookup('controller:business.mainpage');
    //   mainpageController.switchMainPage('customer-service-detail');
    // },
    //个人信息
    information(informationParams){
      if(informationParams){
        this.set("informationParams",true);
        this.set("healthParams",false);
        this.set("serviceParams",false);
        this.set("recordParams",false);
        this.set("thingParams",false);
        this.set("infoParams",true);
        this.set("liveParams",false);
        this.set("pointParams",false);
        this.set("contactParams",false);
        this.set("healthInfoParams",false);
      }
    },
    //健康监测
    health(healthParams){
      if(healthParams){
        this.set("informationParams",false);
        this.set("healthParams",true);
        this.set("serviceParams",false);
        this.set("recordParams",false);
        this.set("thingParams",false);
      }
    },
    //服务信息
    service(serviceParams){
      if(serviceParams){
        this.set("informationParams",false);
        this.set("healthParams",false);
        this.set("serviceParams",true);
        this.set("recordParams",false);
        this.set("thingParams",false);
      }
    },
    //服务记录
    record(recordParams){
      if(recordParams){
        this.set("informationParams",false);
        this.set("healthParams",false);
        this.set("serviceParams",false);
        this.set("recordParams",true);
        this.set("thingParams",false);
      }
    },
    //事件记录
    thing(thingParams){
      if(thingParams){
        this.set("informationParams",false);
        this.set("healthParams",false);
        this.set("serviceParams",false);
        this.set("recordParams",false);
        this.set("thingParams",true);
      }
    },
    infoClick(infoParams){
      if(infoParams){
        this.set("infoParams",true);
        this.set("liveParams",false);
        this.set("pointParams",false);
        this.set("contactParams",false);
        this.set("healthInfoParams",false);
      }
    },
    liveClick(liveParams){
      if(liveParams){
        this.set("infoParams",false);
        this.set("liveParams",true);
        this.set("pointParams",false);
        this.set("contactParams",false);
        this.set("healthInfoParams",false);
      }
    },
    pointClick(pointParams){
      if(pointParams){
        this.set("infoParams",false);
        this.set("liveParams",false);
        this.set("pointParams",true);
        this.set("contactParams",false);
        this.set("healthInfoParams",false);
      }
    },
    contactClick(contactParams){
      if(contactParams){
        this.set("infoParams",false);
        this.set("liveParams",false);
        this.set("pointParams",false);
        this.set("contactParams",true);
        this.set("healthInfoParams",false);
      }
    },
    healthClick(healthInfoParams){
      if(healthInfoParams){
        this.set("infoParams",false);
        this.set("liveParams",false);
        this.set("pointParams",false);
        this.set("contactParams",false);
        this.set("healthInfoParams",true);
      }
      var clickFlag = this.get('clickFlag');
      clickFlag = ++clickFlag;
      this.set('clickFlag', clickFlag);
      console.log('clickFlag++',this.get('clickFlag'));
    },
 }
});
