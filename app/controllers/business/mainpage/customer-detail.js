import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  switchShowFlag:0,//加载标志
  healthShowFlag:0,//健康加载标志
  dynamicsShowFlag:0,//日志标志
  addLogFlag:0,//添加日志的flag
  showModel:false,
  sourceFlag:"fromHand",

  tabFuncs:Ember.computed(function() {
   var a = new Ember.A();
   var t1 = Ember.Object.create({
     code:"health",
     text:"健康数据"
   });
   var t2 = Ember.Object.create({
     code:"dynamics",
     text:"护理日志"
   });
   var t3 = Ember.Object.create({
     code:"information",
     text:"老人信息"
   });
   a.pushObject(t1);
   a.pushObject(t2);
   a.pushObject(t3);
   return a;
  }),
  init: function(){
    var _self = this;
    this.get("service_PageConstrut").set("showLoader", false);//先关闭mainpage的loading图
    Ember.run.schedule("afterRender",this,function() {
      _self.set("clickActFlag","health");
      _self.incrementProperty("healthShowFlag");
    });
  },
  dynamicsDetail:function(){
    var _self = this;
    Ember.run.schedule("afterRender",this,function() {
      _self.set("clickActFlag","health");
    });
  },
  observeGotoWork:function(){
    // this.set("clickActFlag","health");
    // this.send("switchTab","health");
    var tabFuncs = this.get("tabFuncs");
    tabFuncs.forEach(function(item){
      if(item.get("code")=="health"){
        item.set("selected",true);
      }else {
        item.set("selected",false);
      }
    });
    this.set("tabFuncs",tabFuncs);
    var id = this.get("id");
    console.log("res.resultStr  id",id);
    // var params = {};
    // var filter = {id:id};
    // params.filter = filter;
    // var _self = this;
    // this.store.query("customer",params).then(function(customers){
    //   var customer = customers.get("firstObject");
    //   if(customers.content.length === 0){
    //     _self.set("showModel",true);
    //   }else {
    //     _self.set("showModel",false);
    //     _self.set("customer",customer);
    //   }
    // });
    var customer = this.store.peekRecord('customer',id);
    this.set("customer",customer);
  }.observes('id'),

  actions:{
    switchTab(code){
      console.log("switchTab in",code);
      this.set("curTabCode",code);
      this.set("noticeTag",1);
      this.set("otherChoose",false);
      if(code=='dynamics'){
        this.set("dynamicsShowFlagTrue",true);
      }
      // if(code=='dynamics'){
      //   this.incrementProperty("dynamicsShowFlag");
      // }else if (code=='health') {
      //   this.incrementProperty("healthShowFlag");
      // }
      // this.incrementProperty("switchShowFlag");
    },
    switchShowAction(){
      console.log("switchShowAction in");
      var scanFlag = this.get("scanFlag");
      console.log("scanFlag111",scanFlag);
      if(scanFlag){
        this.set("clickActFlag","health");
        var tabFuncs = this.get("tabFuncs");
        tabFuncs.forEach(function(item){
          if(item.get("code")=="health"){
            item.set("selected",true);
          }else {
            item.set("selected",false);
          }
        });
        this.set("tabFuncs",tabFuncs);
      }
      if(this.get("curTabCode")==='dynamics'){
        this.toggleProperty("dynamicsShowFlagTrue");
      }else if(this.get("curTabCode")==='health'){
        this.incrementProperty("healthShowFlag");
      }
    },

    edit:function(nursinglogId,customerId,nursingId){
      var user = this.get("global_curStatus").getUser();//获取到当前人
      var curnursingId = user.get("employee.id");
      var params = {};
      console.log("curnursingId111",curnursingId,'log nursingId: ',nursingId);
      if(nursingId==curnursingId){
        params = {
          nursinglogId:nursinglogId,
          customerId:customerId,
          source:'edit'
        };
      }else {
        params = {
          nursinglogId:nursinglogId,
          customerId:customerId,
          source:'look'
        };
      }
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('dynamics-detail',params);
      this.set("clickActFlag","dynamics");
    },
    addDynamics:function(customerId){
      console.log("customerId",customerId);
      var addLogFlag = this.get("addLogFlag");
      this.incrementProperty("addLogFlag");
      var params = {
        addLogFlag:addLogFlag,
        customerId:customerId,
        source:'add'
      };
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('dynamics-detail',params);
      this.set("clickActFlag","dynamics");//最笨的方法，进入新页面callback后返回 tab页还是护理日志 也可以用全局变量，详情参考task-detail threadData
    },
    queryHealth(type){
      if(type=="all"){
        this.set("sourceFlag","");//set为空 查询全部
      }else {
        this.set("sourceFlag","fromHand");
      }
    },
    addHealth:function(){
      var customerId = this.get("id");
      var params = {
        customerId:customerId,
        source:'add'
      };
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('health-mobile-detail',params);
    },

  },

});
