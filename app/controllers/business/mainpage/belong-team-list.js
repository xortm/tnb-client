import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  dateService: Ember.inject.service("date-service"),
  feedService: Ember.inject.service('feed-bus'),
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"belongTeamListContainer",
  scrollPrevent:true,

  init: function(){
    let _self = this;
    var curUser = this.get("global_curStatus").getUser();
    var employeeId = curUser.get("employee.id");
    let employeenursinggroups = this.store.peekAll('employeenursinggroup',{});
    let employeenursinggroupsFilter = employeenursinggroups.filterBy("employee.id",employeeId);
    console.log("employeenursinggroups list:",employeenursinggroups);
    console.log("employeenursinggroupsFilter list:",employeenursinggroupsFilter);
    _self.set("employeenursinggroupsFilter",employeenursinggroupsFilter);
    _self.hideAllLoading();
    _self.directInitScoll(true);
  },

  actions:{
    goDetail(employeenursinggroupId,groupId){
      console.log("go detail",employeenursinggroupId);
      console.log("go detail id",employeenursinggroupId);
      var params ={
        teamId:groupId
      };
      var itemId = "belongTeamList_" + employeenursinggroupId;
      $("#" + itemId).addClass("tapped");
      Ember.run.later(function(){
        $("#" + itemId).removeClass("tapped");
        Ember.run.later(function(){
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('belong-team',params);
        },100);
      },200);
    },

  },

});
