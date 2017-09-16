import Ember from 'ember';
// import { translationMacro as t } from "ember-i18n";
import CommonUtil from '../utils/common';
// import BaseBusiness from './business/base-business';
import _ from 'lodash/lodash';

export default Ember.Route.extend({
  breadCrumb: null, //不显示导航
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_notification:Ember.inject.service("notification"),
  modelPre: {},

  initKinEditor(){
    KindEditor.plugin('save', function(K) {
            var editor = this;
            var name = 'save';
            // 点击图标时执行
            editor.clickToolbar(name, function() {
                var str = editor.html();
                    App.lookup('controller:business.mainpage.training-materials').saveKind(str);
            });
    });
    KindEditor.lang({
      save : '保存'
    });
    KindEditor.ready(function(K) {
      console.log("KindEditor ready");
      window.GLOBAL_K = K;
    });
    //通过触发window的load事件的方式，以进行ready回调
    var load_event = document.createEvent('Event');
    load_event.initEvent('load', false, false);
    window.dispatchEvent(load_event);
  },
  beforeModel(transition) {
    //初始化KindEditor
    this.initKinEditor();
    var _self = this;
    var sec = new Ember.RSVP.Promise(function (resolve, reject) {
      //登录入口,先从本地取得当前用户，如果没有则登录
      _self.get("store").query("localstorage/user",{filter:{"current":1}}).then(function (users) {
        console.log("users in query:" + users);
        console.log("users get.len:" + users.get("length"));
        if(users.get("length")===0){
          console.log("need login");
          transition.abort();
          //关闭加载页面
          if(window.cordova){
            var sysFuncPlugin = cordova.require('org.apache.cordova.plugin.SysFuncPlugin');
            sysFuncPlugin.closeLoadingPage();
          }
          _self.gotoLoginPage();
          reject();
          return;
        }
        var userEnt = users.get("firstObject");
        console.log("userData get", userEnt);
        if(userEnt.get('current')===1){
          _self.get("global_curStatus").setUser(userEnt);
        }
        console.log("get user role",_self.get("global_curStatus").getUser());
        _self.get("global_curStatus").login().then(function (userRtn) {
          console.log("userrtn in rol",userRtn);
          //如果是移动端或公众号，判断是否具备相关权限
          if(_self.get("global_curStatus.isMobile")){
            let privileges = userRtn.get("role.privileges");
            console.log("privileges in login:",privileges);
            //获得全部移动端底部菜单
            let mobileAllMenus = privileges.filterBy("type",11);
            console.log("mobileAllMenus:",mobileAllMenus);
            _self.set("mobileAllMenus",mobileAllMenus);
            //处理移动端角色多功能权限
            let mobileFunctionMenus = privileges.filterBy("type",0);
            console.log("mobileFunctionMenus in business:",mobileFunctionMenus.get("length"));
            if(mobileFunctionMenus.get("length")){
              console.log("mobileFunctionMenus in login:",mobileFunctionMenus);
              var currentMobileFunctions = new Ember.A();
              //拿到功能选择区页面要显示的route
              mobileFunctionMenus.forEach(function(mobileFunction){
                if(mobileFunction.get("code") == "cs-user"){
                  currentMobileFunctions.pushObject(mobileFunction);
                }else if(mobileFunction.get("code") == "manager"){
                  currentMobileFunctions.pushObject(mobileFunction);
                }else if(mobileFunction.get("code") == "leader"){
                  currentMobileFunctions.pushObject(mobileFunction);
                }
              });
              console.log("currentMobileFunctions:",currentMobileFunctions);
              console.log("currentMobileFunctions length:",currentMobileFunctions.get("length"));
              _self.get("global_curStatus").set("currentMobileFunctions",currentMobileFunctions);
              if(currentMobileFunctions.get("length") == 1){
                //如果长度为1,则设置为false,登陆以后直接跳转到此页面
                _self.get("global_curStatus").set("currentMobileFunctionsNums",false);
                // let functionCode = currentMobileFunctions.get('firstObject').get("code");
                // console.log("functionCode in business:",functionCode);
                // _self.get("global_curStatus").set("footBarMenusShowFlag",functionCode);
              }else{
                //如果长度大于1,则设置为true,登陆以后直接跳转到功能选择区页面
                _self.get("global_curStatus").set("currentMobileFunctionsNums",true);
              }
            }

            let privs = null;
            if(_self.get("global_curStatus.isConsumer")){
              privs = privileges.filterBy("type",21);
            }else{
              privs = privileges.filterBy("type",11);
            }
            if(privs.get("length")===0){
              //把当前用户设置为不可用
              userEnt.set("current", 0);
              userEnt.save().then(function(){
                transition.abort();
                _self.gotoLoginPage();
                reject();
              });
            }
          }
          resolve(userRtn);
        }, function (event) {
          //登录失败后跳转到登录页面
          console.log("reject and login");
          _self.transitionTo('user-login');
          reject(event);
        });
      });
    });
    return new Ember.RSVP.Promise(function (resolve, reject) {
      sec.then(function(){
        //返回菜单数据
        var curUser = _self.get("global_curStatus").getUser();
        console.log("curUser in:", curUser);
        // if(_self.get("global_curStatus.isJujia")||_self.get("global_curStatus.isConsumer")){
        //   //通过user获得居家customerid
        //   var curUserId = curUser.get("id");
        //   console.log("curUserId in:", curUserId);
        //   _self.get("store").query("staffcustomer",{filter:{staff:{id:curUserId}}}).then(function(staffcustomerList){
        //     if(!staffcustomerList.get("firstObject")){return;}//youhua
        //     var curCustomer = staffcustomerList.get("firstObject").get("customer");
        //     console.log("curCustomer in:", curCustomer);
        //     _self.get("global_curStatus").setCustomer(curCustomer);
        //   });
        // }
        //发送socket登录
        _self.get("service_notification").socketLogin();
        //通过用户的角色，查询对应的权限列表
        curUser.get("role").then(function (role) {
          console.log("role get:", role);
          //如果没有role，从服务器上取得角色以及权限信息并存本地
          var privPromise = null;
          if(!role){
            privPromise = new Ember.RSVP.Promise(function (resolve, reject) {
              _self.store.findRecord("user",curUser.get("id")).then(function(userRemote){
                console.log("userRemote:",userRemote);
                userRemote.get("role").then(function(roleRemote){
                  console.log("roleRemote:",roleRemote);
                  //保存到本地
                  _self.get("global_curStatus").saveRoleWithUser(roleRemote,curUser).then(function(roleEnt){
                    resolve(roleEnt.get("privileges"));
                  });
                });
              });
            });
          }else{
            privPromise = role.get("privileges");
          }
          console.log("privPromise:",privPromise);
          privPromise.then(function (privilegesIn) {
            privilegesIn = privilegesIn.sortBy("level","order");
            console.log("privilegesIn sort",privilegesIn);
            //权限列表生成树形
            var voMenuTree = new Ember.A();
            var voFuncTree = new Ember.A();
            var i = 0;
            var len = privilegesIn.get("length");
            console.log("privilegesIn:", privilegesIn);
            console.log("len:", len);
            //数据处理，并判断是否需要resolve返回
            var endTransfer = function (voItem) {
              i++;
              console.log("voItem get:", voItem);
              //轮循结束后，转化为树形对象，并返回
              var oritext = voItem.text;
              //多语言转换
              //voItem.text = _self.get('i18n').t(oritext).string;
              //首先维护功能树
              voFuncTree.pushObject(voItem);
              //如果没有文字，则说明不是菜单
              if(!voItem.text){
                return;
              }
              var voItemCopy = jQuery.extend({}, voItem);
              //然后维护菜单树
              if(voItem.type===1){
                voMenuTree.pushObject(voItemCopy);
              }
              if (i >= len) {
                // voFuncTree = _.sortBy(voFuncTree, ["level","order"]);
                // voMenuTree = _.sortBy(voMenuTree, ["level","order"]);
                voFuncTree = _.sortBy(voFuncTree, function(item){
                  return 1000*parseInt(item.level)  + parseInt(item.order);
                });
                voMenuTree = _.sortBy(voMenuTree, function(item){
                  return 1000*parseInt(item.level)  + parseInt(item.order);
                });
                console.log("voMenuTree get:", voMenuTree);
                var voFuncTreeRtn = CommonUtil.Common_flatToTree(voFuncTree);
                var voMenuTreeRtn = CommonUtil.Common_flatToTree(voMenuTree);

                console.log("need resolve,voRtn", voFuncTreeRtn);
                voMenuTreeRtn = _.sortBy(voMenuTreeRtn,"order");
                //拼装model
                _self.set("modelPre.treedata",{children: voMenuTreeRtn});
                //把功能树放到全局服务
                _self.get("service_PageConstrut").set("funcTreeData",voFuncTree);
                console.log("need resolve tree model");
                resolve();
              }
            };
            privilegesIn.forEach(function (privilege) {
              var voItem = {
                id: privilege.get("id"),
                text: privilege.get("showName"),
                icon: privilege.get("icon"),
                code: privilege.get("code"),
                type:privilege.get("type"),
                level:privilege.get("level"),
                order:privilege.get("order"),
              };
              if (privilege.get("level") === 1) {
                //第一级直接放入数组
                endTransfer(voItem);
              } else {
                //填入上级id
                console.log("level not 1 and privilege id:" + privilege.get("id"));
                console.log("level not 1 and privilege parent id:" + privilege.get("parent.id"));
                voItem.parentId = privilege.get("parent.id");
                endTransfer(voItem);
              }
            });
          });
        },function(){
          console.log("get role fail");
        });
      });
    });
  },
  gotoLoginPage: function(){
    let loginPage = 'user-login';
    //如果是老人公众号，则进入老人绑定页面
    if(this.get("global_curStatus.isConsumer")){
      if(this.get("global_curStatus.isJujia")){
        //居家用户仍用原登录页面
        loginPage = 'user-login';
      }else{
        // let prevHref = window.location.href;
        // let href = prevHref + "index.html?type=consumer";
        // console.log("cur href in business:",href);
        // //用户类型，包括公众号C端用户，B端用户
        // var code = CommonUtil.analysisParam(href,"code");
        // console.log("code in params in business:"  + code);
        // if(!code){
        //   // let appid = "wxb9095899c5b0f132";//老人关爱微信公众号
        //   let appid = "wxf390a271a31e6e03";//天年宝微信公众号
        //   let hrefCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ appid + "&redirect_uri="+ encodeURIComponent(href) + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
        //   console.log("hrefCode:",hrefCode);
        //   window.location.href= hrefCode;
        // }
        // return;
        loginPage = 'bind-customer';
      }
    }
    this.transitionTo(loginPage);
  },
  model(params,transition){
    var _self = this;
    console.log("modelPre.treedata:",this.get("modelPre.treedata"));
    /*预置数据处理*/
    Ember.run.later(this,function(){
      //字典数据和配置数据
      this.get("global_dataLoader").syncDictData(function(){
        _self.get("global_dataLoader").syncConfigData();

        //获得本租户的权限列表,pc端使用
        if(!_self.get("global_curStatus").get("isMobile")){
          _self.get("global_dataLoader").syncPrivilegeData();
        }
        //获得所有权限，运营使用
        if(_self.get("global_curStatus.tenantId")==="111"){
          console.log("need all privileges");
          _self.get("global_dataLoader").syncAllPrivilegeData();
        }
        // return;
        //预置字典数据
        // _self.get('store').query("dicttypetenant",{}).then(function(dicttypestenant){
        //   let Arr = new Ember.A();
        //   dicttypestenant.forEach(function(dicttype){
        //     dicttype.set("typegroupCode",dicttype.get("typegroupTenant.typegroupcode"));
        //     Arr.pushObject(dicttype);
        //   });
        //   _self.get('global_dataLoader').set("dicttypestenant",Arr);
        //   return;
        // });
        //预置系统配置数据
        // _self.get('store').query("conf",{}).then(function(confList){
        //   let Arr = new Ember.A();
        //   confList.forEach(function(conf){
        //     Arr.pushObject(conf);
        //   });
        //   _self.get('global_dataLoader').set("confList",Arr);
        // });
        if(!_self.get("global_curStatus").get("isMobile")){
          //护理等级
          // _self.get('store').query("nursinglevel",{}).then(function(nursinglevelList){
          //   let Arr = new Ember.A();
          //   nursinglevelList.forEach(function(nursinglevel){
          //     Arr.pushObject(nursinglevel);
          //   });
          //   _self.get('global_dataLoader').set("serviceLevel",Arr);
          // });
          //等级推荐项目
          // _self.get('store').query("nursinglevelitem",{}).then(function(nursinglevelitemList){
          //   let Arr = new Ember.A();
          //   nursinglevelitemList.forEach(function(nursinglevelitem){
          //     Arr.pushObject(nursinglevelitem);
          //   });
          //   _self.get('global_dataLoader').set("serviceLevelitemList",Arr);
          // });
        }else{
          //获取默认的业务完成情况
          // _self.get('store').query("servicefinishlevel",{filter:{remark:"default"}}).then(function(finishList){
          //   _self.get('global_dataLoader').set("serviceFinishDefaultList",finishList);
          // });
        }
        //为居家项目查找staffcustomer表
        if(_self.get("global_curStatus.isJujia")){
          // _self.get('store').query("staffcustomer",{}).then(function(staffcustomerList){
          //   let Arr = new Ember.A();
          //   staffcustomerList.forEach(function(staffcustomer){
          //     Arr.pushObject(staffcustomer);
          //   });
          //   _self.get('global_dataLoader').set("staffcustomerList",Arr);
          // });
        }
        // if(_self.get("global_curStatus.isJujia")||_self.get("global_curStatus.isConsumer")){
        //   //通过user获得居家customerid
        //   var curUser = _self.get("global_curStatus").getUser();
        //   console.log("curUser in staffcustomer:", curUser);
        //   var curUserId = curUser.get("id");
        //   console.log("curUserId in staffcustomer:", curUserId);
        //   let staffcustomerList = _self.get('global_dataLoader').get("staffcustomerList");
        //   console.log("staffcustomerList in business:",staffcustomerList);
        //   let curStaffcustomer =  staffcustomerList.findBy("staff.id",curUserId);
        //   if(!curStaffcustomer){return;}
        //   console.log("curStaffcustomer in business:", curStaffcustomer);
        //   let curCustomer =  curStaffcustomer.get("customer");
        //   console.log("curCustomer Id",curCustomer.get("id"));
        //   console.log("curCustomer name",curCustomer.get("name"));
        //   console.log("curCustomer in public bedId",curCustomer.get("bed.id"));
        //   console.log("curCustomer in public allBedName",curCustomer.get("bed.allBedName"));
        //   console.log("curCustomer in staffcustomer:", curCustomer);
        //   _self.get("global_curStatus").setCustomer(curCustomer);
        // }
        if(_self.get("global_curStatus.isJujia")||_self.get("global_curStatus.isConsumer")){
          //通过user获得居家customerid
          let staffcustomerList = _self.get('global_dataLoader').get("staffcustomerList");
          console.log("staffcustomerList in business:",staffcustomerList);
          let curCustomer =  staffcustomerList.get("firstObject");
          _self.get("global_curStatus").setCustomer(curCustomer);
        }
        //房间床位相关
        _self.rebuildBuiding();
        //当数据加载完毕后设置标志位供移动端使用
        console.log("commonInitHasCompleteFlag in business",_self.get("global_curStatus").get("commonInitHasCompleteFlag"));
        _self.get("global_curStatus").set("commonInitHasCompleteFlag",true);
      });
    },50);
    var model = {treedata: this.get("modelPre.treedata")};
    return model;
  },
  rebuildBuiding: function(callback){
    var _self = this;
    _self.get("global_dataLoader").set("roomRebuild",true);
    _self.get("global_dataLoader").set("floorRebuild",true);
    //默认导入所有床位信息
    // this.get('store').query("bed",{ignoreLinks:["createUser","groups","lastUpdateUser","nursingType"]}).then(function(beds){
      //根据bed内的属性，逐级取得对应的楼宇楼层房间
      let beds = _self.get("global_dataLoader.beds");
      let roomList = beds.mapBy("room");
      roomList = roomList.uniqBy("id");
      //单独记录楼层id以备后续改变时进行追述
      roomList.forEach(function(room){
        if(room.get('floor.id')){
          room.set("floorId",room.get("floor.id"));
        }

      });
      _self.get('global_dataLoader').set("allRoomList",roomList);
      let floorList = roomList.mapBy("floor");
      floorList = floorList.uniqBy("id");
      _self.get('global_dataLoader').set("allFloorList",floorList);
      //单独记录楼宇id以备后续改变时进行追述
      floorList.forEach(function(floor){
        if(floor.get('id')&&floor.get('building.id')){
          floor.set("buildingId",floor.get("building.id"));
        }
      });
      let buildingList = floorList.mapBy("building");
      buildingList = buildingList.uniqBy("id");
      _self.get('global_dataLoader').set("allBuildingList",buildingList);
      //把床位数组放入全局
      let bedList = new Ember.A();
      beds.forEach(function(bed){
        //生成冗余room编号，后续使用
        bed.set("roomId",bed.get("room.id"));
        bedList.pushObject(bed);
      });
      _self.get('global_dataLoader').set("allBedList",bedList);
      _self.get("global_dataLoader").set("roomRebuild",false);
      _self.get("global_dataLoader").set("floorRebuild",false);
      //预置老人信息
      // var filter = {
      //   'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
      //   'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
      // };
      // _self.get("store").query("customer",{filter:filter,
      //   ignoreLinks:["town"]}).then(function(customerList){
      //   customerList.forEach(function(customer){
      //     let bedId = customer.belongsTo("bed").id();
      //     let bed = _self.get('global_dataLoader').get("allBedList").findBy("id",bedId);
      //     customer.set("bed",bed);
      //   });
      //   _self.get("global_dataLoader").set("customerSelecter",customerList);
      //   //预置服务老人对象
      //   if(_self.get("global_curStatus").get("serveCustomerId") != "all"){
      //     let customer = customerList.findBy("id",_self.get("global_curStatus").get("serveCustomerId"));
      //     _self.get("global_curStatus").set("serveCustomer",customer);
      //   }
      // });
      if(_self.get("global_curStatus").get("isMobile")){
        if(!_self.get("global_curStatus.isConsumer")){
          let customerList = _self.get("global_dataLoader").get("customerList");
          customerList.forEach(function(customer){
            let bedId = customer.belongsTo("bed").id();
            let bed = _self.get('global_dataLoader').get("allBedList").findBy("id",bedId);
            customer.set("bed",bed);
          });
          _self.get("global_dataLoader").set("customerSelecter",customerList);
          //预置服务老人对象
          if(_self.get("global_curStatus").get("serveCustomerId") != "all"){
            let customer = customerList.findBy("id",_self.get("global_curStatus").get("serveCustomerId"));
            _self.get("global_curStatus").set("serveCustomer",customer);
          }
          //从本地存储中取得选定的老人id,并放入全局变量
          var serveCustomerId =localStorage.getItem("serveCustomerId");
          if(serveCustomerId){
            _self.get("global_curStatus").set("serveCustomerId",serveCustomerId);
          }else {
            _self.get("global_curStatus").set("serveCustomerId","nolocal");
          }
          if(_self.get("global_curStatus").get("serveCustomerId") == "nolocal"){
            if(callback){
              callback();
            }
            return;
          }
        }
      }
      if(callback){
        callback();
      }
    // });
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    //当为公众号时,生成底部菜单
    if(this.get("global_curStatus.isConsumer")){
      //移动端底部菜单数据
      let privileges = this.get('store').peekAll("privilege");
      console.log("privileges:",privileges);
      let mobileMenus = null;
      //移动端和公众号取得不同类型菜单
      mobileMenus = privileges.filterBy("type",21);
      let mobileMenusFilter = mobileMenus.filter(function(menu){
        if(!_self.get("global_curStatus.isJujia")){
          if(menu.get("code")==="publicnumber-service"||
          menu.get("code")==="publichealth-data"||
          menu.get("code")==="accounts-message"){
            return true;
          }
          return false;
        }else{
          if(menu.get("code")==="jujia-my"||
          menu.get("code")==="jujia-healthy"||
          menu.get("code")==="jujia-shopping"||
          menu.get("code")==="jujia-activity"){
            return true;
          }
          return false;
        }
      });
      mobileMenusFilter = mobileMenusFilter.sortBy("order");
      controller.set("mobileMenus",mobileMenusFilter);
      console.log("mobileMenus:",mobileMenusFilter);
      if(this.get("global_curStatus.isConsumer")){
        return;
      }
    }
  },
});
