import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "nursingplanexeList",
  infiniteModelName: "nursingplanexe",
  infiniteContainerName:"userMemberConsumeContainer",

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
    _self.set("curCustomer",curCustomer);
    //获取消费信息
    _self.infiniteQuery("nursingplanexe",{
        filter:{itemProject:{project:{customer:{id:curCustomerId}}}},
        sort:{exeStartTime:"desc"}
    }).then(function(nursingplanexeList){
      console.log("nursingplanexeList",nursingplanexeList);
      _self.set("nursingplanexeList",nursingplanexeList);
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
