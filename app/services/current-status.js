import Ember from 'ember';
import config from '../config/environment';
const { callStatus_noCall,callStatus_calling, callStatus_inCall,callStatus_callEnd,callStatus_callFail } = Constants;

/*
 * 当前客户端状态的服务类,包括当前人员，通话，任务，客户端类型等
 */
export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  global_dataLoader: Ember.inject.service('data-loader'),

  curStatus: {},
  flag: false,
  tenantId: null,
  isConsumer: false,//是否老人公众号
  queryCusObj: {},//查询个人/全部老人的标识
  preventRepeatSubmitFlag: true,//阻止按钮在五秒内重复点击当为true时可以提交
  commonInitHasCompleteFlag: false,//business中数据已经加载完成的标志
  // setDrugDaysRemind: 10, //设置缺药提醒天数
  isOrgMobile:Ember.computed("isConsumer","isMobile",function(){
    if(!this.get("isMobile")){
      return false;
    }
    return !this.get("isConsumer");
  }),
  isJujia: false,//是否居家系统
  serveCustomerId: null,//生活照料,健康护理的老人id
  healtyCustomerId: null,//体检指标的老人id
  logCustomerId: null,//护理日志的老人id
  attendanceEmployeeId: null,//护理日志的老人id
  chartShow: true,//公众号健康数据切换,默认显示图表
  currentMobileFunctions: null,//移动端功能区菜单数组
  currentMobileFunctionsNums: false,//是否跳转到移动端功能区页面
  footBarMenusShowFlag: null,//footbar中要显示哪些导航菜单的标志位
  videoObj: null,//存正在播放的video对象

  init() {
    this._super(...arguments);
    var curStatus = Ember.Object.create({
      currentUser: Ember.Object.create(),
      //当前锁定的任务
      currentTask: Ember.Object.create(),
      currentCall: Ember.Object.create({
        status: 0 //默认状态为0
      }),
      //当前用户拥有的任务
      currentTaskList: Ember.A([]),
    });
    this.set('curStatus', curStatus);
  },
  //阻止按钮在5秒内重复点击
  preventRepeatSubmitFlagObs: function(){
    let _self = this;
    console.log("preventRepeatSubmitFlag in curstatus:",this.get("preventRepeatSubmitFlag"));
    if(!this.get("preventRepeatSubmitFlag")){
      Ember.run.later(function(){
        _self.set("preventRepeatSubmitFlag",true);
        console.log("preventRepeatSubmitFlag in curstatus after:",_self.get("preventRepeatSubmitFlag"));
      },5000);
    }
  }.observes("preventRepeatSubmitFlag").on("init"),
  //老人id变化后，重新设置已选老人对象
  serveCustomerIdObs: function(){
    let _self = this;
    console.log("serveCustomerId in obs:",this.get("serveCustomerId"));
    if(!this.get("serveCustomerId")||!this.get("global_dataLoader.allBedList")){
      return;
    }
    localStorage.serveCustomerId = this.get("serveCustomerId");
    console.log("run in obs serveCustomerId",this.get("serveCustomerId"));
    if(this.get("serveCustomerId") == "all" || this.get("serveCustomerId") == "nolocal"){
      console.log("run in obs");
      return;
    }
    let customer = _self.get("global_dataLoader").get("customerSelecter").findBy("id",_self.get("serveCustomerId"));
    _self.set("serveCustomer",customer);
    console.log("serveCustomer",customer);
    _self.set("serveCustomerId",this.get("serveCustomerId"));
    //预置服务老人对象
  }.observes("serveCustomerId").on("init"),

  //老人id变化后，重新设置已选老人对象
  healtyCustomerIdObs: function(){
    let _self = this;
    if(!this.get("healtyCustomerId")||!this.get("global_dataLoader.allBedList")){
      return;
    }
    let customer = _self.get("global_dataLoader").get("customerSelecter").findBy("id",_self.get("healtyCustomerId"));
    _self.set("healtyCustomer",customer);
    _self.set("healtyCustomerId",this.get("healtyCustomerId"));
  }.observes("healtyCustomerId").on("init"),

  //老人id变化后，重新设置已选老人对象
  logCustomerIdObs: function(){
    let _self = this;
    if(!this.get("logCustomerId")||!this.get("global_dataLoader.allBedList")){
      return;
    }
    let customer = _self.get("global_dataLoader").get("customerSelecter").findBy("id",_self.get("logCustomerId"));
    _self.set("logCustomer",customer);
    _self.set("logCustomerId",this.get("logCustomerId"));
  }.observes("logCustomerId").on("init"),

  //员工id变化后，重新设置已选老人对象
  attendanceEmployeeIdObs: function(){
    let _self = this;
    if(!this.get("attendanceEmployeeId")){
      return;
    }
    if(this.get("attendanceEmployeeId") == "all"){
      console.log("run in obs");
      return;
    }
    let employee = _self.get("global_dataLoader").get("employeeSelecter").findBy("id",_self.get("attendanceEmployeeId"));
    _self.set("attendanceEmployee",employee);
  }.observes("attendanceEmployeeId").on("init"),


  //判断是否移动设备
  isMobile: Ember.computed(function() {
    var md = new MobileDetect(window.navigator.userAgent);
    console.log("md.mobile()", md.mobile());
    if (md.mobile()) {
      return true;
    }
    return false;
  }),
  //判断是否Pad设备
  isPad: Ember.computed(function() {
    var md = new MobileDetect(window.navigator.userAgent);
    if (md.tablet()) {
      return true;
    }
    return false;
  }),
  //判断是否android
  isAndroid: Ember.computed(function() {
    var md = new MobileDetect(window.navigator.userAgent);
    return !md.is('iPhone');
  }),
  //判断是否android
  isIphone: Ember.computed(function() {
    var md = new MobileDetect(window.navigator.userAgent);
    return md.is('iPhone');
  }),
  //跳转到首页
  goHome: function(controller){
    if(this.get("isMobile")){
      //移动端使用切换route的方式
      controller.transitionToRoute('application');
    }else{
      //pc端使用页面跳转的方式，避免css缩小
      this.toIndexPage();
    }
  },
  toIndexPage: function(){
    var href = "index.html";
    console.log("config.environment:" + config.environment);
    if(this.get("isMobile")){
      if(this.get("isConsumer")){
        if(this.get("isJujia")){
          //居家公众号进入服务页面
          href = "index.html?type=consumer&systype=2";
        }else{
          //机构公众号进入服务页面
          href = "index.html?type=consumer";
          window.location.href = href + '&v='+Math.random();//加上随机数 (微信不能跳转不安全连接window.location.href必须加参数 清除缓存)
          return;
        }
      }else {
        if(config.environment!=="development"){
          if(this.get("isAndroid")){
            // href = "index_android.html";//暂时注释掉 还没应用
            href = "index.html";
          }else{
            // href = "index_ios.html";//暂时注释掉 还没应用
            href = "index.html";
          }
        }
      }
    }else{
      if(this.get("isJujia")){
        //居家页面
        href = "index.html?systype=2";
      }
    }
    window.location.href = href;
  },
  isCustomerService:Ember.computed("curStatus.currentUser",function() {
    return this.get("curStatus.currentUser.isCustomerService");
  }),
  setUser: function (user) {
    this.set("curStatus.currentUser", user);
  },
  getUser: function () {
    var curStatus = this.get("curStatus");
    return curStatus.get("currentUser");
  },
  //获得真实的user对象
  getUserReal: function () {
    let realUser = this.get("store").peekRecord("user",this.getUser().get("id"));
    console.log("realUser in status:",realUser);
    return realUser;
  },
  //居家项目和手机公众号的customer
  setCustomer: function (curCustomer) {
    this.set("curStatus.currentCustomer", curCustomer);
    console.log("curStatus.currentCustomer", curCustomer);
  },
  getCustomer: function () {
    var curStatus = this.get("curStatus");
    console.log("curStatus.get", curStatus.get("currentCustomer"));
    return curStatus.get("currentCustomer");
  },
  getTask: function () {
    var curStatus = this.get("curStatus");
    return curStatus.get("currentTask");
  },
  setTask: function (task) {
    this.set("curStatus.currentTask", task);
  },
  getCall: function () {
    var curStatus = this.get("curStatus");
    return curStatus.get("currentCall");
  },
  setCall: function (call) {
    this.set("curStatus.currentCall", call);
  },
  isCalling: function () {
    console.log("isCalling call:", this.getCall().get("status"));
    if (!this.getCall()) {
      return false;
    }
    if (this.getCall().get("status") === callStatus_calling) {
      return true;
    }
    return false;
  },
  inCall: function () {
    console.log("incall call:", this.getCall());
    if (!this.getCall()) {
      return false;
    }
    if (this.getCall().get("status") === callStatus_inCall) {
      return true;
    }
    return false;
  },
  addTask: function (task) {
    this.get("curStatus").get("currentTaskList").pushObject(task);
  },
  setTasks: function (tasks) {
    this.get("curStatus").set("currentTaskList", tasks);
  },
  getTasks: function () {
    return this.get("curStatus").get("currentTaskList");
  },
  getOtherTasks: function () {
    var curTask = this.getTask();
    var otherTasks = new Ember.A();
    var taskList = this.getTasks();
    if(this.get("isCustomerService")){
      taskList.forEach(function(userTask){
        if(userTask.get('id') !== curTask.get("id")){
          otherTasks.pushObject(userTask);
        }
      });
    }else{
      taskList.forEach(function(task){
        if(task.get('id') !== curTask.get("id")){
          otherTasks.pushObject(task);
        }
      });
    }
    return otherTasks;
  },

  //用户登录
  login: function (flag) {
    var _self = this;
    var event = {};
    return new Ember.RSVP.Promise(function (resolve, reject) {
      console.log("do login");
      //从本地取预存的用户名和密码进行登录
      _self.get("store").query("localstorage/user", {filter: {current: 1}}).then(function (users) {
        var curUser = users.get("firstObject");
        //hack!!!!!!!!!!!!!!!
        var userHack = Ember.Object.create({
          id:1,
          loginName:curUser.get("loginName"),
          password:curUser.get("password"),
          token:curUser.get('token'),
        });
        console.log('curUser token:',curUser.get('token'));
        _self.setUser(userHack);
        console.log("curUser get:", userHack);
        //直接返回
        if(flag){
          console.log("local login");
          _self.setUser(curUser);
          return resolve(curUser);
        }
        console.log("do remote query");
        //提交后返回登录用户信息
        var sessionPromise = _self._getSessionPromise(userHack);
        sessionPromise.then(function (sessionsRtn) {
          console.log("sessionsRtn get", sessionsRtn);
          //存储用户并把当前用户放入全局服务
          var userRtn = sessionsRtn.get("firstObject");
          console.log("userRtn is", userRtn);
          if(!userRtn){
            var e = {};
            console.log("session create fail", e);
            e.code = 1;
            //登录失败，返回错误码
            reject(e);
            return;
          }
          //设置全局租户变量
          _self.set("tenantId",userRtn.belongsTo("tenant").id());
          console.log("tenantId has set:" + _self.get("tenantId"));
          //_self.copyProperties(sessionRtn.get("user"),curUser);
          userRtn.get("role").then(function (role) {
            console.log("has role is", role);
            if (!role) {
              //查不到角色，说明没有变化或者不需要初始化，直接使用本地的信息
              console.log("no role,curUser:", curUser);
              curUser.get('role').then(function(roleLocal){
                console.log("roleLocal has",roleLocal);
              });
              _self.setUser(userRtn);
              resolve(userRtn);
              return;
            }
            _self.setUser(userRtn);
            resolve(userRtn);
          }, function () {
            //查不到角色，说明没有变化或者不需要初始化，直接使用本地的信息
            console.log("role err");
            return resolve(curUser);
          });
        }, function (e) {
          console.log("session create fail", e);
          e.code = 1;
          //登录失败，返回错误码
          reject(e);
        });
      }, function () {
        //拿不到用户，说明是第一次使用
        event.code = 0;
        reject(event);
      });
    });
  },
  clearUser: function(){
    var _self = this;
    this.get("store").findRecord("localstorage/user",this.getUser().get("id")).then(function(user){
      user.destroyRecord();
      _self.setUser(null);
    });
  },
  //适用通用的data query
  _getSessionPromise: function (curUser) {
    let filter = {
      loginName: curUser.get("loginName"),
      password: curUser.get("password"),
      include:{userSession:"employee"}
    };
    return this.get("store").query("userSession", {
      filter: filter,
      //忽略多余关联
      ignoreLink:["org","staffStatus"],
    });
  },
  //保存角色数据以及对应的用户数据更新
  saveRoleWithUser: function (role,curUser) {
    var _self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      //直接使用远程的role对象
      curUser.set("role", role);
      resolve(role);
    });
  },
  //保存角色和菜单权限信息到本地
  saveRoleAndPrivilege: function (role) {
    var _self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      //首先存权限数据，然后存角色数据
      var roleEnt = _self.get("store").createRecord("localstorage/role");
      role.get("privileges").then(function (privileges) {
        console.log("privileges get", privileges);
        var len = privileges.get("length");
        var index = 0;
        _self.batchSavePrivilege(privileges).then(function (privilegesSaved) {
          console.log("bat save over", privilegesSaved);
          roleEnt.set("name", role.get("name"));
          roleEnt.set("id", role.get("id"));
          roleEnt.set("privileges", privilegesSaved);
          roleEnt.save().then(function (roleData) {
            console.log("save back,res");
            resolve(roleData);
          });
        });
      });
    });
  },
  /*
   * 批量存储权限到本地
   * @param privileges 权限数据
   * @return promise
   */
  batchSavePrivilege: function (privileges) {
    var _self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var privilegeEntities = Ember.A();
      var privilegesData = Ember.A();
      //先存储基本信息，后续再添加
      var beforePromise = new Ember.RSVP.Promise(function (saveRes, saveRej) {
        var len = privileges.get("length");
        var index = 0;
        //先清空本地的权限信息
        _self.clearLocalstoreByKey("localstorage/privilege").then(function(){
          privileges.forEach(function (privilege) {
            var privilegeEnt = _self.get("store").createRecord("localstorage/privilege");
            //拷贝所有属性
            Object.keys(privilege.toJSON()).forEach(function (key) {
              var value = privilege.get(key);
              //父级需要特殊处理
              if (key === "parent") {
                if (value.content) {
                  // console.log("id value:", value);
                  privilegeEnt.set("parent", value);
                }
              } else {
                privilegeEnt.set(key, value);
              }
            });
            //id需要单独保存
            privilegeEnt.set("id", privilege.get("id"));
            // console.log("begin save privilegeEnt:",privilegeEnt);
            privilegeEnt.save().then(function (privilegeData) {
              //预存入数组
              // console.log('save and push');
              privilegeEntities.pushObject(privilegeData);
              index++;
              if (index >= length) {
                saveRes(privilegeEntities);
              }
            });
          });
        });
      });
      var savePromise = new Ember.RSVP.Promise(function (saveRes, saveRej) {
        beforePromise.then(function (privilegeEnts) {
          console.log("privilegeEnts", privilegeEnts);
          var len = privilegeEnts.get("length");
          var index = 0;
          var pushdata = function (privilegeData) {
            // console.log("pushdata in", privilegeData);
            privilegesData.push(privilegeData);
            index++;
            if (index >= len) {
              saveRes(privilegesData);
            }
          };
          privilegeEnts.forEach(function (privilegeEnt) {
            // console.log("privilegeEnt get", privilegeEnt);
            if (privilegeEnt.get("parent") && privilegeEnt.get("parent").get("id")) {
              var parentId = privilegeEnt.get("parent").get("id");
              // console.log("parent is", privilegeEnt.get("parent"));
              _self.get("store").findRecord("localstorage/privilege", parentId).then(function (privilegeInLocal) {
                // console.log("privilegeInLocal get", privilegeInLocal);
                privilegeEnt.set("parent", privilegeInLocal);
                //本地的上级权限对象重置到子权限对象，并把子权限对象放入返回数组
                privilegeEnt.save().then(function (privilegeData) {
                  pushdata(privilegeData);
                });
              });
            } else {
              //上级权限对象直接放入返回数组
              pushdata(privilegeEnt);
            }
          });
        });
      });
      savePromise.then(function (privilegesDataRes) {
        console.log("privilegesDataRes", privilegesDataRes);
        resolve(privilegesDataRes);
      });
    });

  },
  //清除对应key的所有本地存储内容
  clearLocalstoreByKey: function(key){
    var _self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      console.log("clearLocalstoreByKey in,key:" + key);
      _self.get("store").findAll(key).then(function(rsArray){
        var len = rsArray.get("length");
        if(len===0){
          resolve();
          return;
        }
        // console.log("len is:" + len + " with key:" + key);
        var endTransfer = function(index){
          // console.log("index:" + index + " and len:" + len);
          if(index>=len){
            resolve();
          }
        };
        var index = 0;
        rsArray.forEach(function(localEnt){
            localEnt.destroyRecord().then(function(){
              index++;
              endTransfer(index);
            });
        });
      });
    });
  },
  /*
   * 根据来电号码(以及任务)查询通话记录，如果有，则返回通话对应客户
   * @return 通话信息的promise
   */
  findCustomerWithCall: function (callNumber) {
    var _self = this;
    console.log("query callNumber:" + callNumber);
    var customerPromise = this.get("store").query("call", {filter: {callNumber: callNumber}}).then(function (calls) {
      //var callEnt = _self.get("store").createRecord("call", {});
      //callEnt.set("type", 1);
      //callEnt.set("callNumber", callNumber);
      //callEnt.set("callTime", new Date());
      console.log("calls in", calls);
      var len = calls.get("length");
      var customer = {};
      if (len === 0) {
        return customer;
      }
      var call = calls.get("firstObject");
      console.log("call get", call);
      return call.get("customer").then(function (customerEnt) {
        //添加通话对应的客户
        console.log("customer in call get", customerEnt);
        return customerEnt;
      });
    });
    return customerPromise;
  }
});
