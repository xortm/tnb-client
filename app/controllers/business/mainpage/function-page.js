import Ember from 'ember';

export default Ember.Controller.extend({
  global_curStatus: Ember.inject.service("current-status"),
  mainController: Ember.inject.controller('business.mainpage'),

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
      }
    });
    _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
  },

  actions:{
    switchShowAction(){
    },
    switchPage:function(menuLink,elementId,flag){
      let _self = this;
      console.log("elementId:",elementId);
      console.log("flag:",flag);
      this.get("global_curStatus").set("footBarMenusShowFlag",flag);
      var itemId = elementId;
      let routeHome = menuLink;
      let careChoice = localStorage.getItem(Constants.uickey_careChoice);
      console.log("careChoice:",careChoice);
      if(menuLink == "service-care"&&careChoice&&careChoice==="service-nurse"){
        routeHome = "service-nurse";
      }
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage(routeHome);
        },100);
      },200);
    },

  },

});
