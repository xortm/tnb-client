import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "serviceCheckList",
  infiniteModelName: "servicecheck",
  infiniteContainerName:"serviceCheckContainer",
  queryFlagInFlag: 0,
  constants:Constants,

  customerObs: function(){
    var _self = this;
    console.log("queryFlagInFlag:",this.get("queryFlagInFlag"));
    let staff = this.get('global_curStatus').getUser();
    this.infiniteQuery('servicecheck',{filter:{staff:{id:staff.get('employee.id')}},sort:{'createDateTime':'desc'}});
  }.observes("queryFlagInFlag",'delFlag','flag').on("init"),

  actions:{
    switchShowAction(){
      this.directInitScoll(true);
      this.incrementProperty('queryFlagInFlag');
    },
    delAction(){
      this.incrementProperty('delFlag');
    },
    addCheck(){
      var _self = this;
      var params = {};
      params= {source:"add",itemIdFlag:Math.random()};
      console.log("gotoDetail params",params);
      var itemId = "service-check-add";
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('service-check-detail-mobile',params);
        },100);
      },200);
    },
  },

});
