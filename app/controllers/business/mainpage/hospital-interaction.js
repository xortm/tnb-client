import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  mainController: Ember.inject.controller('business.mainpage'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"hospitalInteractionContainer",
  stopScroll: true,//阻止下拉刷新的所有操作
  init:function(){
    console.log("run in init");
    this.hideAllLoading();
  },
  actions:{
    switchPage:function (menuLink,elementId) {//个人信息 界面
      console.log("id```````",elementId);
      var _self = this;
      var itemId = elementId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          _self.get("mainController").switchMainPage(menuLink);
        },100);
      },200);
    },

  },
});
