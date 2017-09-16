import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';
const { taskApplyStatus_apply,taskApplyStatus_applySuc,taskApplyStatus_applyFail} = Constants;

export default Ember.Controller.extend(InfiniteScroll,{
  queryCondition:'',
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "financialList",
  infiniteModelName: "financial",
  infiniteContainerName:"financialContainer",
  queryParams:{},
  tabFuncs:Ember.computed(function() {
    var a = new Ember.A();
    var t1 = Ember.Object.create({
      code:"todayTask",
      selected:true,
      text:"当日任务"
    });
    var t2 = Ember.Object.create({
      code:"finished",
      text:"已完成任务"
    });
    a.pushObject(t1);
    a.pushObject(t2);
    return a;
  }),
  // customerList:Ember.computed("queryParams",function() {
  //   var queryParams =  this.get("queryParams");
  // }),
  customerListObs: function(){
    var queryParams =  this.get("queryParams");
    var _self = this;
    console.log("customerListObs in,queryParams",queryParams);
    this.get("store").query('customer', {filter: {"id@$lte":3}}).then(function(customerList){
      console.log("+++++++++++++++++++",customerList);
      _self.set("customerList",customerList);
    });

  }.observes('queryParams'),


  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_queryTask', this, 'queryTask');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_queryTask', this, 'queryTask');
  }.on('willDestroyElement'),

  actions:{
    switchTab(code){
      console.log('switchTab in,code:' + code);
      this.set("curTabCode",code);
    },
    goDetail(customer){
      console.log("go detail",customer);
      var mainpageController = App.lookup('controller:business.mainpage');
      var id = customer.get("id");
      mainpageController.switchMainPage('customer-hometravel-info',{id:id});
    },
    toAddPage(){
      var mainpageController = App.lookup('controller:business.mainpage');
      //var id = this.get("customer").get("id");
     mainpageController.switchMainPage('customer-add');
    //alert("111111");
    }
  }
});
