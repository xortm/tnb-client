import Ember from 'ember';

export default Ember.Controller.extend({
  global_curStatus: Ember.inject.service("current-status"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  dataLoader: Ember.inject.service("data-loader"),

  tenantName:Ember.computed(function(){
    let _self = this;
    let currentTenantId = this.get("global_curStatus").get("tenantId");
    console.log("currentTenantId:",currentTenantId);
    let tenantList = this.get("dataLoader").get("tenantList");
    console.log("tenantList:",tenantList);
    let currentTenantName = "";
    tenantList.forEach(function(tenant){
      if(tenant.get("id") == currentTenantId){
        currentTenantName = tenant.get("orgName");
      }
    });
    return currentTenantName;
  }),

  /*从global_curStatus中拿到页面要显示的信息*/
  init: function(){
    var _self = this;
    //该用户多拥有的功能入口
    let currentMobileFunctions = _self.get("global_curStatus").get("currentMobileFunctions");
    console.log("currentMobileFunctions in function-page:",currentMobileFunctions);
    currentMobileFunctions.forEach(function(currentMobileFunction){
      let code = currentMobileFunction.get("code");
      let name = currentMobileFunction.get("showName");
      if(code == "cs-user"){
        _self.set("csUser",true);
        _self.set("csUserName",name);
      }else if(code == "manager"){
        _self.set("manager",true);
        _self.set("managerName",name);
      }else if(code == "leader"){
        _self.set("leader",true);
        _self.set("leaderName",name);
      }else if(code == "jujiaManager"){
        _self.set("jujiaManager",true);
        _self.set("jujiaManagerName",name);
      }else if(code == "jujiaUser"){
        _self.set("jujiaUser",true);
        _self.set("jujiaUserName",name);
      }
    });
    // _self.set("global_curStatus.headerBarHasReady",true);//标志headerbar加载完毕
    _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
  },
  canSwitch:true,
  actions:{
    switchShowAction(){
      this.set('canSwitch',true);
    },
    switchPage:function(menuLink,elementId,flag){
      console.log("switchPage in");
      let _self = this;
      let itemId = elementId;
      let routeHome = menuLink;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          let canSwitch = _self.get('canSwitch');
          if(canSwitch){
            console.log("elementId:",elementId);
            console.log("flag:",flag);
            // 服务显示哪个route
            let switchServiceFlag = _self.get("global_curStatus.switchServiceFlag");
            //所在功能区
            let curFlag = _self.get("global_curStatus.footBarMenusShowFlag");
            //会退回来的route名字
            let functionPageRoute = _self.get("global_curStatus.functionPageRoute");
            if(!curFlag){
              if(flag == "cs-user"){
                if(switchServiceFlag){
                  routeHome = switchServiceFlag;
                }
              }else{
                routeHome = menuLink;
              }
            }else{
              if(curFlag == flag){
                if(functionPageRoute){
                  routeHome = functionPageRoute;
                }
              }else{
                if(flag == "cs-user"){
                  let careChoice = localStorage.getItem(Constants.uickey_careChoice);
                  console.log("careChoice:",careChoice);
                  if(careChoice&&careChoice==="service-care"){
                    routeHome = "service-care";
                  }else{
                    routeHome = "service-nurse";
                  }
                }else{
                  routeHome = menuLink;
                }
              }
            }
            _self.get("mainController").switchMainPage(routeHome,{},function(){
              //处理主页面中的底部菜单等，异步回调方式
              _self.set('canSwitch',false);
              _self.set("global_curStatus.preventMenuChange",true);
              let curFlag = _self.get("global_curStatus.footBarMenusShowFlag");
              if(curFlag != flag){
                _self.get("global_curStatus").set("footBarMenusShowFlag",flag);
              }
              if(curFlag){
                if(curFlag == flag){
                  _self.set("global_curStatus.preventMenuChange",false);
                }
              }
            });
          }
        },100);
      },200);
    },
  },

});
