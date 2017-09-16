import Ember from 'ember';
import _ from 'lodash/lodash';
import config from '../../config/environment';

export default Ember.Route.extend({

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
    this._super(controller, model);
    controller.setProperties(model);
    this.set("controller",controller);
  },
  //阻止下级页面直接访问
  afterModel: function(model,transition) {
    // return;
    let _self = this;
    var routeHome = "cs-home";
    var curUser = this.get("global_curStatus").getUser();
    //意味着刷新后跳转到主页面
    if(this.get("global_curStatus").get("isMobile")){
      //如果是公众号，进入对应菜单
      if(this.get("global_curStatus").get("isConsumer")){
        if(this.get("global_curStatus.isJujia")){
          //居家公众号进入服务页面
          routeHome = "jujia-my";
        }else{
          //机构公众号进入服务页面
          routeHome = "publicnumber-service";
        }
      }else{
        console.log("currentMobileFunctionsNums in business:",_self.get("global_curStatus").get("currentMobileFunctionsNums"));
        if(_self.get("global_curStatus").get("currentMobileFunctionsNums")){
          routeHome = "function-page";
        }else{
          let functionCode = _self.get("global_curStatus").get("currentMobileFunctions").get('firstObject').get("code");
          console.log("functionCode in mainpage:",functionCode);
          _self.get("global_curStatus").set("footBarMenusShowFlag",functionCode);
          //根据不同的功能区选择进入不同的首页
          if(functionCode == "cs-user"){
            console.log("functionCode eq:",functionCode);
            routeHome = "service-care";
            let careChoice = localStorage.getItem(Constants.uickey_careChoice);
            console.log("careChoice:",careChoice);
            if(careChoice&&careChoice==="service-nurse"){
              routeHome = "service-nurse";
            }
          }else if(functionCode == "manager"){
            console.log("functionCode eq:",functionCode);
            routeHome = "attendance-check";
          }else if(functionCode == "leader"){
            console.log("functionCode eq:",functionCode);
            routeHome = "consultation-management-mobile";
          }
        }
      }
      // routeHome = "service-care";
    }
    console.log("afterModel in,routeHome:" + routeHome);
    this.controllerFor("business.mainpage").switchMainPage(routeHome);
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
    changePage:function(routeName,params){
      console.log("changePage from:" + routeName);
      this.render('business/mainpage/' + routeName, {
        into: 'business.mainpage',
        outlet: routeName
      });
      if(params){
        //把参数直接放到目标controller中
        var targetController = App.lookup("controller:business.mainpage." + routeName);
        Object.keys(params).forEach(function(key){
          var paramKey = params[key];
          targetController.set(paramKey,params[paramKey]);
        });
      }
    },
  }
});
