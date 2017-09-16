import Ember from 'ember';
import _ from 'lodash/lodash';
import InfinityRoute from '../addon/ember-infinity/mixins/infinity-route';
import RouteMixin from '../addon/ember-cli-pagination/remote/route-mixin';
/*
 * 页面整体布局服务
 */
export default Ember.Service.extend(Ember.Evented, InfinityRoute,RouteMixin,{
  statusService: Ember.inject.service("current-status"),
  feedBus: Ember.inject.service("feed-bus"),
  notify: Ember.inject.service(),

  preTransitionFlag: 0,//跳转标记
  preTransitionFlagObs: function(){
    console.log("this.preTransitionFlag:" + this.get("preTransitionFlag"));
  }.observes("preTransitionFlag"),
  curTransitionFlagFlagObs: function(){
    console.log("this.curTransitionFlag:" + this.get("curTransitionFlag"));
  }.observes("curTransitionFlag"),
  backBtnTime: 0, //返回按钮计次
  hasSwitch: false,
  mainpageController: null, //反向注入mainpageController
  funcTreeData: null, //功能树数据
  transitionParams: null,
  curRouteName: null, //当前路由名称
  backPath: null, //后退路径
  crumRouteList: [], //当前路由链
  routeList: [], //路由记录
  switchCounter: 0,//页面切换记录，用于其他组件进行页面事件监控
  showLoader: false, //是否显示加载页面
  /*
   * 页面状态,0.未创建 1.未激活 2.transition 3.已显示 4.已隐藏
   *  5.didRender 6.didInsertElement 7.scroll refresh over 8.after render
   */
  pageStatus: null,
  pageInLoading: false,//标志页面正在进行加载
  //设置cordova事件
  setCordovaEventTriggers: Ember.on('init', function() {
    if (!window.cordova) {
      return;
    }
    var _self = this;
    var CORDOVA_EVENTS = Ember.A([
      'deviceready',
      'pause',
      'resume',
      'backbutton',
      'menubutton',
      'searchbutton',
      'startcallbutton',
      'endcallbutton',
      'volumedownbutton',
      'volumeupbutton',
      'batterycritical',
      'batterylow',
      'batterystatus',
      'online',
      'offline'
    ]);
    document.addEventListener("deviceready", function() {
      console.log("deviceready event:");
      //显示进度
      var sysFuncPlugin = cordova.require('org.apache.cordova.plugin.SysFuncPlugin');
      sysFuncPlugin.showProgress({type:"main",progressDur:"1"});
      //定义原生事件
      CORDOVA_EVENTS.forEach(function(eventName) {
        Ember.$(document).on(eventName, function() {
          console.log("cordova event:" + eventName);
          _self.trigger(eventName);
        });
      });
    }, false);
    var backFunc = function(that) {
      console.log("currentMobileFunctionsNums:", _self.get("statusService.currentMobileFunctionsNums"));
      console.log("showFootBar:", _self.get("showFootBar"));
      console.log("backPath:", _self.get("backPath"));
      // var curRouteName = _self.get("curRouteName");
      // console.log("curRouteName in backFunc:" + curRouteName);
      // if(curRouteName === "function-page"){
      //   return false;
      // }

      //退回上一级页面
      if (_self.get("backPath")) {
        console.log("need back up");
        var businessCtrl = App.lookup("controller:business");
        businessCtrl.send("changeMainPage", _self.get("backPath"));
        return;
      }
      //如果存在多功能区,且route为主页直接跳转到多功能区
      if (_self.get("statusService.currentMobileFunctionsNums") && _self.get("showFootBar")) {
        console.log("need back up to function-page");
        App.lookup("controller:business").send("changeMainPage", "function-page");
        return;
      }
      console.log("need quit");
      var backTime = _self.get("backBtnTime");
      //如果已经在一级页面，则提示双击退出
      backTime++;
      _self.set("backBtnTime", backTime);
      console.log("eventBackButton in,MAINVAL_backTime:" + backTime);
      if (backTime > 1) {
        navigator.app.exitApp();
        return;
      }
      //注销返回键,3秒后重新注册
      Ember.run.later(this, function() {
          _self.set("backBtnTime", 0);
      }, 3000);
        //显示退出提示
      _self.showToast();
    };
    //安卓手机回退按钮事件
    this.on('backbutton', this,function(){
      backFunc(this);
    });
    //接收pause不做处理
    this.on('pause', this,function(){
      // backFunc(this);
    });
  }),
  showToast: function() {
    console.log("showToast in");
    //显示退出提示
    //var notify = this.get('notify');
    //notify.show("info", "再次点击回退按钮将退出应用!");
    var detailController = App.lookup("controller:business");
    detailController.popTorMsg("再次点击回退按钮将退出应用!");
  },
  showFootBar: Ember.computed('curPath','curRouteName', function() {
    var curRouteName = this.get("curRouteName");
    console.log("curRouteName in showFootBar:" + curRouteName);
    if(curRouteName === "function-page"){
      return false;
    }
    if(this.get("statusService").get("isJujia")){
        return true;
    }
    var curPath = this.get("curPath");
    console.log("curPath is:" + curPath);
    if (curPath === "cs-info"||
      curPath === "service-care" ||
      curPath === "service-nurse" ||
      curPath === "customer-business" ||
      // curPath === "customer-health" ||
      curPath === "customer-warning" ||
      // curPath === "customer-point" ||
      curPath === "nurse-log" ||
      curPath === "attendance-check" ||
      curPath === "employee-assessment" ||
      curPath === "view-score" ||
      curPath === "connect-manage" ||
      curPath === "service-query" ||
      curPath === "other-business" ||
      curPath === "consultation-management-mobile" ||
      curPath === "workdelivery-self-mobile" ||
      curPath === "workdelivery-view-mobile"
      // curPath === "pressure-sores-care" ||
      // curPath === "customer-dynamic-list" ||
      // curPath === "evaluation-info" ||
      // curPath === "evaluate-template" ||
      // curPath === "result-management" ||
      // curPath === "risk-form-management" ||
      // curPath === "risk-result-record" ||
      // curPath === "record-detail"
      ) {
      return true;
    }
    //公众号菜单判断
    if(this.get("statusService.isConsumer")){
      if(!this.get("statusService").get("isJujia")){
        if (curPath === "publicnumber-service" || curPath === "publichealth-data" || curPath === "accounts-message") {
          return true;
        }
      }
      if(this.get("statusService").get("isJujia")){
        if (curPath === "jujia-my" || curPath === "jujia-healthy" || curPath === "jujia-shopping" || curPath === "jujia-activity") {
          return true;
        }
      }
    }
    return false;
  }),
  /*********************计算导航信息**********************/
  breadCrumbsProcess: function(breadCrumbsPath) {
    var treeList = this.computeBreadCrumbs(breadCrumbsPath);
    console.log("treeList in busi", treeList);
    if (!treeList) {
      return;
    }
    var curInfoItem = treeList[treeList.length - 1];
    if (!curInfoItem) {
      return;
    }
    this.set("pageTitle", curInfoItem.title);
    this.set("curPath", curInfoItem.url);
    console.log("curPath in breadCrumbsProcess:",this.get("curPath"));
    //只有一级则不需要返回按钮
    if (treeList.length < 2) {
      this.set("backPath", null);
      return;
    }
    //通过数组找到上级对象，并设置上级路径
    var backInfoItem = treeList[treeList.length - 2];
    console.log("need set backpath:" + backInfoItem.url);
    this.set("backPath", backInfoItem.url);
  }.observes('curRouteName'),

  computeBreadCrumbs: function(breadCrumbsPath) {
    var curRouteName = this.get("curRouteName");
    console.log("curRouteName in curRouteName:" + curRouteName);
    //取得路由定义
    var routeItem = this.getRouteDef(curRouteName);
    if (!routeItem) {
      console.warn("no this route:" + curRouteName);
      return;
    }
    var treeList = [];
    var list = this.get("crumRouteList");
    var newList = [];
    var crumbDataProcess = function(funcItem) {
      //检查是否存在此name,如果有，则截取到此
      var hasItem = false;
      //如果是菜单项(手机菜单项)，清空之前的路由链
      if (funcItem.type === 1 || funcItem.type === 11 || funcItem.type === 21) {
        list = [];
        list.push(funcItem);
      }
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        newList.push(item);
        //如果有之前匹配的，则截断
        if (item.code === funcItem.code) {
          hasItem = true;
          break;
        }
      }
      //如果没有，则附加到后面
      if (!hasItem) {
        newList.push(funcItem);
      }
    };
    //规划导航列表数据
    crumbDataProcess(routeItem);
    this.set("crumRouteList", newList);
    //返回导航信息
    this.get("crumRouteList").forEach(function(routeItem) {
      treeList.push({
        title: routeItem.text,
        url: routeItem.code,
        page: routeItem.page
      });
    });
    console.log("treeList is", treeList);
    return treeList;
  },
  //取得路由节点定义
  getRouteDef: function(routeName) {
    var rmodel = this.get("funcTreeData");
    var routeMatch = _.filter(rmodel, {
      code: routeName,
    });
    let hasPageRoute = rmodel.filter(function(item){
      return item.page > 0;
    });
    if(hasPageRoute.length>0){
      if(!this.get('crumRouteList').findBy('code',hasPageRoute[0].code)){
        //判断页面是否需要记忆页码，把其他的记忆好的设为0
        let item = rmodel.findBy('code',hasPageRoute[0].code);
        item.page = 0;
      }
    }
    console.log("routeMatch is in:", routeMatch);
    if (routeMatch && routeMatch.length > 0) {
      return routeMatch[0];
    }
  },
  getCurrentRouteName: function(routePath) {
    var t = routePath.split(".");
    if (t.length > 2) {
      return t[2];
    }
  },


  /*********************动态路由控制部分*********************/
  createRouteItem: function(routeName, params) {
    var route = Ember.Object.create({
      routeName: routeName,
      params: params,
      destroy: false,
      routeInstance: null,
      status: 0, //route实例状态，0未创建 1未激活 2已激活 3已显示 4已隐藏
      backRender: false, //是否后台渲染
    });
    route.reopen({
      isHide: Ember.computed('status', function() {
        if (this.get("status") === 4) {
          return true;
        }
        return false;
      }),
      displayClass: Ember.computed('isHide', function() {
        if (this.get("isHide")) {
          return "hide";
        }
        return "show";
      }),
    });
    return route;
  },
  //取得当前路由实体
  currentRouteInstance: Ember.computed('curRouteName', function() {
    console.log("currentRouteInstance get in");
    return this.getRouteItemWithInst(this.get("curRouteName"));
  }),
  //取得route实例
  getRouteItemWithInst: function(routeName) {
    var route = this.get("routeList").findBy("routeName", routeName);
    if (!route) {
      return null;
    }
    if (!route.get("routeInstance")) {
      return null;
    }
    return route;
  },
  //把route实例添加到route记录,并设置状态
  dispatchRouteInst: function(routeName, status) {
    console.log("dispatchRouteInst,routeName:" + routeName + " and status:" + status);
    //设置页面状态
    this.set("pageStatus",status);
    //隐藏加载页面
    if (status === 2) {
      // this.set("showLoader", false);
    }
    var route = this.get("routeList").findBy("routeName", routeName);
    if (!route) {
      return false;
    }
    var routeInst = route.get("routeInst");
    if (!routeInst) {
      //如果还没有实例，通过lookup方式找到route实例，并放入记录
      var routeFullName = "business.mainpage." + routeName;
      routeInst = App.lookup("route:" + routeFullName);
      console.log("attachRouteInst:", routeInst);
      route.set("routeInstance", routeInst);
      //手动设置当前route定义对象
      if (status === 2) {
        this.set("currentRouteInstance", route);
      }
    }
    //状态设置
    route.set("status", status);
    this.set("pageStatus",status);
    //累加页面切换计数
    this.incrementProperty("switchCounter",1);
  },
  //打开一个路由页面
  openRoute: function(routeName, params) {
    var routeList = this.get("routeList");
    console.log("routeName is:" + routeName);
    var route = this.getRouteItemWithInst(routeName);
    //如果路由已存在，则返回
    if (route) {
      //立刻显示此路由
      route.set("status", 3);
      this.set("pageStatus",3);
      return;
    }
    route = this.createRouteItem(routeName, params);
    this.get("routeList").pushObject(route);
    //由于此时route还未被使用，因此利用transitionToRoute来渲染，从而可以获得route实例
    var routeFullName = "business.mainpage." + routeName;
    console.log("routeFullName:" + routeFullName);
    var routeInst = App.lookup("route:" + routeFullName);
    console.log("routeInst loop:", routeInst);
    //设置前台转场标志
    this.get("feedBus").set("frontTranspage",routeName);
    //转场处理
    this.directTransition(routeName, params);
  },
  //关闭一个路由页面
  closeRoute: function(routeName) {
    var routeOri = this.getRouteItemWithInst(routeName);
    if (!routeOri) {
      return;
    }
    //销毁route实例，同时设置destroy属性
    routeOri.get("routeInstance").destroy();
    routeOri.set("destroy", true);
  },
  //显示一个路由页面
  showRoute: function(routeName, params) {
    console.log("show route,params",params);
    var _self = this;
    var route = this.getRouteItemWithInst(routeName);
    if (!route) {
      return;
    }
    //记录参数
    if (params) {
      route.set("params", params);
    }
    var routeInst = route.get("routeInstance");
    console.log("routeInst get", routeInst);
    var controllerName = "business.mainpage." + routeName;
    var controller = App.lookup("controller:" + controllerName);
    //如果当前route是从后台渲染模式切换的，则给对应页面发送切换事件
    if (route.get("backRender")) {
      console.log("need send switch event to:" + routeName);
      route.set("backRender", false);
      //如果当前route是从后台渲染模式切换的，则直接去掉mainpage中的loading图标
      this.set("showLoader", false);
      // controller.send("switchShowAction");
    }
    //隐藏加载页面
    // this.set("showLoader", false);
    //通过设置状态属性来显示
    route.set("status", 3);
    this.set("pageStatus",3);
    //由于不跳转页面了，因此需要额外设置导航信息
    var busiUrlPath = "business.mainpage." + routeName;
    this.set("breadCrumbsPath", busiUrlPath);
    //设置当前route对象
    this.set("currentRouteInstance", route);
    if (params) {
      //把参数直接放到目标controller中
      Object.keys(params).forEach(function(key) {
        var value = params[key];
        console.log("set paramKey:" + key + " with value:" + value);
        controller.set(key, value);
      });
    }
    console.log("send show action");
    //发送显示切换事件
    controller.send("switchShowAction");
  },
  //隐藏一个路由页面
  hideRoute: function(routeName) {
    var route = this.getRouteItemWithInst(routeName);
    if (!route) {
      return;
    }
    var _self = this;
    //如果是未激活状态，则先渲染到指定位置
    if (route.get("status") === 1) {
      console.log("need prepare for:" + routeName);
      //设置后台渲染标志
      route.set("backRender", true);
      //设置后台转场标志
      this.get("feedBus").set("backTranspage",routeName);
      Ember.run.next(this, function() {
        var targetController = App.lookup("controller:business.mainpage." + routeName);
        _self.get("mainpageController").get("target").send("changePage", routeName,targetController.getProperties());
      });
    }
    console.log("hide,routeName:" + routeName);
    //通过设置status属性来隐藏
    route.set("status", 4);
    // this.set("pageStatus",4);
  },
  //主页面跳转
  switchMainPageTrack: function(routeName, oriRouteName, params) {
    var _self = this;
    //设置transition标志，用于识别是否history的页面跳转
    this.incrementProperty("preTransitionFlag");
    console.log("changeMainPage in,routeName:" + routeName + " and oriRouteName:" + oriRouteName);
    //相同的route不做处理
    if (routeName === oriRouteName) {
      console.log("changeMainPage in,routeName:" + routeName + " and oriRouteName:" + oriRouteName);
      if (!this.get("hasSwitch")) {
        //第一次切换时忽略原网址，不视为相同route
        oriRouteName = null;
      } else {
        this.set("showLoader", false);
        console.log("showLoader in switchMainPageTrack");
        return;
      }
    }
    this.set("hasSwitch", true);
    //显示加载页面
    console.log("need set showLoader true");
    this.set("showLoader", true);
    this.set("curRouteName", routeName);
    //定义本路由的out输出
    console.log("target is:", this.get('target'));
    if (!this.get("statusService.isMobile")) {
      //电脑版直接进行链接处理
      this.directTransition(routeName, params);
      return;
    }
    //设置页面当前状态
    // this.set("pageInLoading",true);
    this.set("pageStatus",1);
    if (oriRouteName) {
      var oriRouteItem = this.getRouteItemWithInst(oriRouteName);
      if (oriRouteItem) {
        var oriInst = oriRouteItem.get("routeInstance");
        var oriController = oriInst.get("controller");
        console.log("oriController is", oriController);
        //屏蔽InfinityRoute的自动加载
        oriController.set("notLoadMore", true);
        //由于需要transition到别的路由，之前的路由应该处于非激活状态，在此设置
        this.dispatchRouteInst(oriRouteName, 1);
        //隐藏之前的route
        this.hideRoute(oriRouteName);
      }
    }
    //显示指定的route
    if (!this.getRouteItemWithInst(routeName)) {
      //如果没有实例，需要先transition
      console.log("need open route:" + routeName);
      this.set("pageInLoading",true);
      Ember.run.later(function(){
        _self.openRoute(routeName, params);
      },1);
    } else {
      console.log("need show route:" + routeName);
      //恢复InfinityRoute的自动加载
      var routeItem = this.getRouteItemWithInst(routeName);
      var routeInst = routeItem.get("routeInstance");
      var routeController = routeInst.get("controller");
      console.log("routeController is", routeController);
      routeController.set("notLoadMore", false);
      //显示页面
      this.showRoute(routeName, params);
      //隐藏之前的route
      if (oriRouteName) {
        this.hideRoute(oriRouteName);
      }
    }
  },
  directTransition: function(routeName, params) {
    var link = "business.mainpage." + routeName;
    if (params) {
      var queryParams = {
        queryParams: params
      };
      console.log("directTransition to:" + link + " with params:", queryParams);
      this.get("mainpageController").transitionToRoute(link, queryParams);
    } else {
      this.get("mainpageController").transitionToRoute(link);
    }
  },
  splitRouteParams: function(params) {
    var concatName = routeName;
    console.log("params in", params);
    if (params) {
      //如果有参数，使用路由方式拼接
      var param = "";
      console.log("keys:", Object.keys(params));
      Object.keys(params).forEach(function(key) {
        //把参数值拼入url
        param = param + "." + params[key];
        concatName = concatName + param;
      });
      console.log("concatName after:" + concatName);
    }
    return concatName;
  },
});
