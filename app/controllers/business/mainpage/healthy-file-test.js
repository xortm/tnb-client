import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"userHealthyFileTestContainer",

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  service_notification:Ember.inject.service("notification"),
  statusService: Ember.inject.service("current-status"),
  constants:Constants,
  showModal: false, //弹出层默认是否显示
  init: function(){
    this.queryFlagIn();
  },
  queryFlagIn: function(){
    var curCustomer = this.get("statusService").getCustomer();//获取居家curCustomer
    var curCustomerId = curCustomer.get("id");//获取居家curCustomerId
    var _self = this;
    _self.store.query("physicalReport",{
      filter:{customer:{id:curCustomerId}},
      sort:{createTime:"desc"}
    }).then(function(physicalReportList){
      let picPath =  physicalReportList.get("firstObject").get('picPathUrl');
      let contents =  physicalReportList.get("firstObject").get('contents');
      console.log("picPath",picPath);
      _self.set("picPath",picPath);
      _self.set("contents",contents);
      _self.hideAllLoading();
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
