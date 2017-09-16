import Ember from 'ember';
import finishService from '../../../controllers/finish-service';

export default Ember.Controller.extend(finishService,{
  directInitScollFlag:0,
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  service_PageConstrut: Ember.inject.service('page-constructure'),

  /*通过event service监控顶部菜单的选择事件，并进行相关方法调用*/
  listenner: function() {
    console.log("feedService reg");
    this.get('feedService').on('headerEvent_Scan_serviceCare', this, 'showScanServiceCare');
  }.on('init'),
  //注销时清除事件绑定
  cleanup: function() {
    console.log("cleanup feed");
    this.get('feedService').off('headerEvent_Scan_serviceCare', this, 'showScanServiceCare');
  }.on('willDestroyElement'),

  showScanServiceCare: function(){
    var itemId = "customer_scan";
    $("#" + itemId).addClass("tapped");
    Ember.run.later(function(){
      $("#" + itemId).removeClass("tapped");
      Ember.run.later(function(){
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('scanQRCode',{type:'serviceCare'});
        // mainpageController.switchMainPage('scan-qrcode');
        // alert("in action showScan switch");
      },100);
    },200);
  },
//只有当当前页面时route是service-care时,才会把切换以后的老人id传递给组件,使其加载数据
  serveCustomerIdObs: function(){
    var customerId = this.get("global_curStatus.serveCustomerId");
    var curRoutePath=this.get('service_PageConstrut').get('curRouteName');
    if(curRoutePath === "service-care"){
      this.set("serveCustomerId",customerId);
    }
  }.observes("global_curStatus.serveCustomerId").on("init"),

  actions:{
    switchShowAction(){
      this.incrementProperty("directInitScollFlag");
      //当以后切换进入页面时,才把全部选好的老人id传给组件
      var customerId = this.get("global_curStatus.serveCustomerId");
      this.set("serveCustomerId",customerId);
    },

  },
});
