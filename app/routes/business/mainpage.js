import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Route.extend({
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_worker:Ember.inject.service("worker-proc"),
  hasIn: false,

  beforeModel: function(transition){
    var _self = this;
    var router = App.lookup('router:main');
    //处理路由映射数据
    var routeNames = router.router.recognizer.names;
    console.log("routeNames is",routeNames);
  },

  model(params,transition) {
    console.log("mainpage model");
    return {};
  },

  setupController: function(controller, model){
    console.log("setupController in mainpage");
    if(this.get("hasIn")){
      return;
    }
    this.set("hasIn",true);
    this._super(controller, model);
    controller.setProperties(model);
    this.set("controller",controller);
    this.pageInitProcess();
  },
  //阻止下级页面直接访问
  afterModel: function(model,transition) {
    // return;
  },
  pageInitProcess(){
    let _self = this;
    var routeHome = "cs-home";
    var curUser = this.get("global_curStatus").getUser();
    //如果是测试模式，则不跳转
    if(this.get("service_worker").isTestMode()){
      console.log("rtn for test");
      return;
    }
    //PC端直接进入首页
    if(!this.get("global_curStatus").get("isMobile")){
      this.controllerFor("business.mainpage").switchMainPage(routeHome);
      return;
    }
    //针对公众号或者移动端，进入不同首页面
    routeHome = this.getHomePageName();
    this.set("homePage",routeHome);
    //创建空白路由，后续实际路由使用
    for(let i=1;i<=this.get("service_PageConstrut.totalBlankPageNum");i++){
      let routeName = this.get("service_PageConstrut").getBlankPageName(i);
      this.get("service_PageConstrut").pushBlankRoute(routeName);
      let curRouteName = "business.mainpage." + routeName;
    }
    let curRouteName = this.get("service_PageConstrut").getBlankPageName(1);
    curRouteName = "business.mainpage." + curRouteName;
    //进入第一个空白页面，进行链式创建
    this.transitionTo(curRouteName);
  },
  toHomePage: function(){
    this.controllerFor("business.mainpage").switchMainPage(this.get("homePage"));
  },
  getHomePageName: function(){
    let routeHome = null;
    if(this.get("global_curStatus").get("isConsumer")){
      if(this.get("global_curStatus.isJujia")){
        //居家公众号进入服务页面
        routeHome = "jujia-my";
      }else{
        //机构公众号进入服务页面
        let homePage = localStorage.getItem(Constants.uickey_homePage);
        console.log("homePage in mainpage:",homePage);
        if(!homePage){
          console.log("run in no");
          routeHome = "customer-dynamic";
        }else{
          console.log("run in yes");
          routeHome = homePage;
        }
      }
    }else{
      console.log("currentMobileFunctionsNums in business:",this.get("global_curStatus").get("currentMobileFunctionsNums"));
      if(this.get("global_curStatus").get("currentMobileFunctionsNums")){
        routeHome = "function-page";
      }else{
        let functionCode = this.get("global_curStatus").get("currentMobileFunctions").get('firstObject').get("code");
        console.log("functionCode in mainpage:",functionCode);
        this.get("global_curStatus").set("footBarMenusShowFlag",functionCode);
        //根据不同的功能区选择进入不同的首页
        if(functionCode == "cs-user"){
          this.set("global_curStatus.preventMenuChange",true);
          console.log("functionCode eq:",functionCode);
          routeHome = "service-nurse";
          let careChoice = localStorage.getItem(Constants.uickey_careChoice);
          console.log("careChoice:",careChoice);
          if(careChoice&&careChoice==="service-care"){
            routeHome = "service-care";
          }
        }else if(functionCode == "manager"){
          this.set("global_curStatus.preventMenuChange",true);
          console.log("functionCode eq:",functionCode);
          routeHome = "attendance-check";
        }else if(functionCode == "leader"){
          this.set("global_curStatus.preventMenuChange",true);
          console.log("functionCode eq:",functionCode);
          routeHome = "consultation-management-mobile";
        }
      }
    }
    return routeHome;
  },
  changePageInroute(routeName,templateName,params){
    console.log("changePageInroute for:" + routeName);
    let _self = this;
    Ember.run.next(function(){
      _self.render('business/mainpage/' + routeName, {
        into: 'business.mainpage',
        outlet: templateName
      });
      if(params){
        //把参数直接放到目标controller中
        var targetController = App.lookup("controller:business.mainpage." + routeName);
        Object.keys(params).forEach(function(key){
          var value = params[key];
          targetController.set(key,value);
        });
      }
    });
  },
  actions:{
    saveRefresh(){
      var _self = this;
      var currentRouteName = Ember.getOwner(_self).lookup('controller:application').currentPath;
      if(currentRouteName&&CommonUtil.Common_endsWith(currentRouteName,".index")){
        console.log("need cut .index");
        currentRouteName = currentRouteName.substr(0,currentRouteName.length-6);
      }
      var currentRouteInstance = Ember.getOwner(_self).lookup('route:' + currentRouteName);
      console.log("currentRouteName:" + currentRouteName);
      //修改全局任务数据
      _self.processTaskInfo().then(function(){
        console.log("do refresh");
        _self.refreshTaskMenu();
        //刷新下级页面
        currentRouteInstance.refresh();
      });
    },
    changePage:function(routeName,templateName,params){
      console.log("changePage from:" + routeName);
      let _self = this;
      Ember.run.next(function(){
        _self.render('business/mainpage/' + routeName, {
          into: 'business.mainpage',
          outlet: templateName
        });
        if(params){
          //把参数直接放到目标controller中
          var targetController = App.lookup("controller:business.mainpage." + routeName);
          Object.keys(params).forEach(function(key){
            var paramKey = params[key];
            targetController.set(paramKey,params[paramKey]);
          });
        }
      });
    },
  }
});
