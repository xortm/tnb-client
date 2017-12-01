import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "",
  infiniteModelName: "",
  infiniteContainerName:"belongTeamContainer",
  scrollPrevent: true,//阻止下拉刷新的所有操作
  mainController: Ember.inject.controller('business.mainpage'),
  showGroupFlag: 0,

  teamIdObs: function(){
    let _self = this;
    _self._showLoading();
    let teamId = this.get("teamId");
    var curUser = this.get("global_curStatus").getUser();
    var employeeId = curUser.get("employee.id");
    let employeenursinggroup;
    let employeeNames = "";
    let customerNames = "";
    _self.store.query('employeenursinggroup',{filter:{healthInfoQueryType:'getCustomers'},include:{employeenursinggroup:"group"}}).then(function(employeenursinggroups){
      console.log("employeenursinggroups:",employeenursinggroups);
      // let employeenursinggroup = employeenursinggroupsFilter.findBy("id",employeenursinggroupId);
      // console.log("employeenursinggroup after:",employeenursinggroup);

      let employeenursinggroupsFilterGroup = employeenursinggroups.filterBy("group.id",teamId);
      employeenursinggroupsFilterGroup.forEach(function(employeenursinggroup){
        employeeNames += employeenursinggroup.get("employee.name")+',';
      });
      console.log("employeeNames:",employeeNames);
      _self.set('employeesNames',employeeNames.substring(0,employeeNames.length-1));
      //获取护理组所有老人的字符串
      let nursegroup = employeenursinggroupsFilterGroup.get("firstObject").get("group");
      console.log("nursegroup:",nursegroup);
      console.log("nursegroup customers:",nursegroup.get("customers"));
      _self.set("nursegroup",nursegroup);
      nursegroup.get("customers").forEach(function(customer){
        customerNames += customer.get("name")+',';
      });
      console.log("customerNames:",customerNames);
      _self.set('customerNames',customerNames.substring(0,customerNames.length-1));
      _self.hideAllLoading();
      _self.directInitScoll(true);
    });

  }.observes("teamId"),

  actions:{
    // toTask(){
    //   var itemId = "toSquare";
    //   $("#" + itemId).addClass("tapped");
    //   Ember.run.later(function(){
    //     $("#" + itemId).removeClass("tapped");
    //   },300);
    //   this.get("global_dataLoader").getMobileMenu().then(function(menus){
    //     var needMenucode = '';
    //     menus.forEach(function(item){
    //       if(item.get("mobileIcon")=='ic-wheelchair'){
    //         needMenucode = item.get("code");
    //         item.set("selected",true);
    //       }else {
    //         item.set("selected",false);
    //       }
    //     });
    //     var businessController = App.lookup("controller:business");
    //     businessController.send("changeMainPage",needMenucode);
    //   });
    //
    //
    // },

  },
});
