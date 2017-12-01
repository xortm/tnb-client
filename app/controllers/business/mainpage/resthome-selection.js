import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"resthomeSelectionContainer",
  stopScroll: true,//阻止下拉刷新的所有操作
  constants: Constants,

  init: function(){
    let _self = this;
    let currentTenantId = this.get("global_curStatus").get("tenantId");
    console.log("currentTenantId:",currentTenantId);
    let tenantList = this.get("dataLoader").get("tenantList");
    console.log("tenantList:",tenantList);
    this.set("currentTenantId",currentTenantId);
    this.set("tenantList",tenantList);
    this.hideAllLoading();
  },

  actions:{
    goDetail(tenant){
      let _self = this;
      console.log("go detail",tenant);
      var id = tenant.get("id");
      console.log("go detail id",id);
      this.set("tenantName",tenant.get("orgName"));
      this.set("tenantId",id);
      var itemId = "tenantItem_" + id;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          if(id == _self.get("currentTenantId")){
            return;
          }
          _self.set('comfirmSwitchFlag',true);
        },100);
      },200);
    },

    comfirmAction(){
      let _self = this;
      this.set('comfirmSwitchFlag',false);
      localStorage.setItem(Constants.uickey_tenantId,this.get('tenantId'));
      localStorage.setItem("serveCustomerId",null);
      // App.lookup("controller:business.mainpage").
      // _self.get("global_curStatus").goHome(_self);
      _self.get("global_curStatus").toIndexPage();

    },

    invitation(){
      this.set('comfirmSwitchFlag',false);
    },



  },

});
