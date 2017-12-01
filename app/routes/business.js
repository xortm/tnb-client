import Ember from 'ember';
import CommonUtil from '../utils/common';

export default Ember.Route.extend({
  breadCrumb: null, //不显示导航
  service_PageConstrut:Ember.inject.service("page-constructure"),
  service_notification:Ember.inject.service("notification"),
  modelPre: {},
  constants: Constants,

  initKinEditor(){
    let _self = this;
    if(!this.get("global_curStatus.isMobile")){
      KindEditor.plugin('save', function(K) {
              var editor = this;
              var name = 'save';
              // 点击图标时执行
              editor.clickToolbar(name, function() {
              console.log('curRouteName in business',_self.get('service_PageConstrut.curRouteName'));
                  var str = editor.html();
                  let curRouteName = _self.get('service_PageConstrut.curRouteName');
                  if(curRouteName=='training-materials'){
                    App.lookup('controller:business.mainpage.training-materials').saveKind(str);
                  }else{
                    App.lookup('controller:business.mainpage.house-chart').saveKind(str);
                  }

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
    }
  },
  beforeModel(transition) {
    //初始化KindEditor
    if(!this.get("global_curStatus.isConsumer")){
      this.initKinEditor();
    }
    var _self = this;
    var sec = new Ember.RSVP.Promise(function (resolve, reject) {
      //登录入口,先从本地取得当前用户，如果没有则登录
      _self.get("store").query("localstorage/user",{filter:{"current":1}}).then(function (users) {
        console.log("users in query:" + users);
        console.log("users get.len:" + users.get("length"));
        if(users.get("length")===0){
          console.log("need login");
          transition.abort();
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
                }else if(mobileFunction.get("code") == "jujiaManager"){
                  currentMobileFunctions.pushObject(mobileFunction);
                }else if(mobileFunction.get("code") == "jujiaUser"){
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
          //验证登录失败以后，去掉applicationHBS中的遮罩层，重新进入登录页
          _self.get("global_curStatus").set("appHasCompleteFlag",true);
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
              // console.log("voItem get:", voItem);
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
                voFuncTree = voFuncTree.sortBy("level","order");
                voMenuTree = voMenuTree.sortBy("level","order");
                console.log("voMenuTree get:", voMenuTree);
                console.log("voMenuTree get:", voFuncTree);
                var voFuncTreeRtn = CommonUtil.Common_flatToTree(voFuncTree);
                var voMenuTreeRtn = CommonUtil.Common_flatToTree(voMenuTree);

                console.log("need resolve,voRtn", voFuncTreeRtn);
                voMenuTreeRtn = voMenuTreeRtn.sortBy("order");
                //拼装model
                _self.set("modelPre.treedata",{children: voMenuTreeRtn});
                //把功能树放到全局服务
                _self.get("service_PageConstrut").set("funcTreeData",voFuncTree);
                console.log("need resolve tree model");
                //数据预加载
                let promise = _self.get("global_dataLoader").dataLoadPro();
                promise.then(function(){
                  resolve();
                });
              }
            };
            privilegesIn.forEach(function (privilege) {
              console.log('privilege id in business',privilege.get('id'),privilege.get('parent.id'));
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
        loginPage = 'bind-customer';
      }
    }
    //取消加载状态
    this.get("global_curStatus").set("appHasCompleteFlag",true);
    this.transitionTo(loginPage);
  },
  model(params,transition){
    console.log("modelPre.treedata:",this.get("modelPre.treedata"));
    // let promise = this.get("global_dataLoader").dataLoadPro();
    let model = {treedata: this.get("modelPre.treedata")};
    return model;
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
          if(menu.get("code")==="consumer-service"||
          menu.get("code")==="publichealth-data"||
          menu.get("code")==="customer-dynamic"||
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
      console.log("mobileMenus:",mobileMenusFilter);
      //判断是否为快捷进入
      let homePage = localStorage.getItem(Constants.uickey_homePage);
      console.log("homePage in buss:",homePage);
      if(!homePage){
        controller.set("mobileMenus",mobileMenusFilter);
      }else{
        let mobileMenusEnd = new Ember.A();
        mobileMenusFilter.forEach(function(menu){
          //重置选中状态
          menu.set("selected",false);
          if(menu.get("code") === homePage){
            menu.set("selected",true);
            mobileMenusEnd.pushObject(menu);
          }else{
            //单个菜单
            mobileMenusEnd.pushObject(menu);
          }
        });
        console.log("mobileMenus mobileMenusEnd:",mobileMenusEnd);
        controller.set("mobileMenus",mobileMenusEnd);
      }
    }
  },
});
