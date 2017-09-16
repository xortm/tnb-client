import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "evaluateResultList",
  infiniteModelName: "evaluateResult",
  infiniteContainerName:"userHealthyFileEvaluateContainer",

  moment: Ember.inject.service(),
  statusService: Ember.inject.service("current-status"),
  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  constants:Constants,
  init: function(){
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    var _self = this;
    _self.infiniteQuery("evaluateresult",{
      filter:{customer:{id:curCustomerId}},
      sort:{createDateTime:"desc"}
    }).then(function(evaluateResultList){
      if(!evaluateResultList&&evaluateResultList.get("length")===0){
        _self.set("global_pageConstructure.showLoader",false);//set 加载图片隐藏
      }
      console.log("evaluateResultList",evaluateResultList);
      _self.set("evaluateResultList",evaluateResultList);
    });
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
