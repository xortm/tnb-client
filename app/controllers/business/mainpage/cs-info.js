import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userCsInfoContainer",
  scrollPrevent: true,//阻止下拉刷新的所有操作
  // stopScroll: true,//阻止下拉刷新的所有操作

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  global_curStatus: Ember.inject.service('current-status'),
  dataLoader: Ember.inject.service("data-loader"),

  constants:Constants,

  uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
  isMobile: Ember.computed("global_curStatus",function () {
    console.log("is mobile:" + this.get("global_curStatus").get("isMobile"));
    return this.get("global_curStatus").get("isMobile");
  }),  //移动端
  name:Ember.computed(function(){return this.get("model.curUser").get('name');}),
  address:Ember.computed(function(){return this.get("model.curUser").get('address');}),
  phone:Ember.computed(function(){return this.get("model.curUser").get('phone');}),
  email:Ember.computed(function(){return this.get("model.curUser").get('email');}),
  age:Ember.computed(function(){return this.get("model.curUser").get('age');}),

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

  init:function(){
    console.log("cs info ctl init");
    this.hideAllLoading();
  },

  //判断是否显示多余条目信息
  footBarMenusShowFlag: Ember.computed('global_curStatus.footBarMenusShowFlag', function() {
    var globalCurStatus = this.get('global_curStatus');
    var footBarMenusShowFlag = globalCurStatus.get("footBarMenusShowFlag");
    console.log("footBarMenusShowFlag in cs-info",footBarMenusShowFlag);
    if(footBarMenusShowFlag === "cs-user"){
      return true;
    }else{
      return false;
    }
  }),

  actions:{
    //页面跳转
    // toBelongTeam:function(menuLink){//所属组队 界面
    //   this.get("mainController").switchMainPage(menuLink);
    // },
    // toMySettings: function(menuLink){//设置 页面
    //   this.get("mainController").switchMainPage(menuLink);
    // },
    switchPage:function (menuLink,elementId) {//个人信息 界面
      console.log("id```````",elementId);
      var _self = this;
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          if(elementId == "belong_team"){
            var curUser = _self.get("global_curStatus").getUser();
            var employeeId = curUser.get("employee.id");
            _self.store.query('employeenursinggroup',{filter:{},include:{employeenursinggroup:"group"}}).then(function(employeenursinggroups){
              let employeenursinggroupsFilter = employeenursinggroups.filterBy("employee.id",employeeId);
              if(!employeenursinggroupsFilter){
                App.lookup("controller:business").popTorMsg("您还未分配护理组");
                return;
              }
              console.log("employeenursinggroups list:",employeenursinggroups);
              console.log("employeenursinggroupsFilter list:",employeenursinggroupsFilter);
              let groupsLength = employeenursinggroupsFilter.get("length");
              console.log("groupsLength list:",groupsLength);
              if(groupsLength > 1){
                menuLink = "belong-team-list";
                _self.get("mainController").switchMainPage(menuLink);
              }else{
                let teamId = employeenursinggroupsFilter.get("firstObject").get("group.id");
                _self.get("mainController").switchMainPage(menuLink,{teamId:teamId});
              }
            });
          }else{
            _self.get("mainController").switchMainPage(menuLink);
          }
        },100);
      },200);
    },
  },

});
