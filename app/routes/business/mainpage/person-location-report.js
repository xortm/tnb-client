import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  model() {
    return {};
  },

  buildQueryParams:function(){
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let filter={};
    let _self = this;
    if (curController) {
        if (curController.get("employee")) {
          filter.employee={};
          filter.employee.id=curController.get("employee").get("id");
        }
        if (curController.get("room")) {
          filter.room={};
          filter.room.id=curController.get("room").get("id");
        }
        if (curController.get("workTime")) {
          filter.wortTimeSetting={};
          filter.wortTimeSetting.id=curController.get("workTime").get("id");
        }
        if (curController.get("beginDate")) {
          filter.beginTime=curController.get("beginDate");
        }
        if (curController.get("endDate")) {
          filter.endTime=curController.get("endDate");
        }
        filter.countWorkTime=curController.get("countWorkTime");
      }
      params.filter = filter;
      params.sort={
        "employee.id":"asc",
        "room.id":"asc"
      };
      if (curController.get("countWorkTime")) {
        params.sort["wortTimeSetting.id"]="asc";
      }
      return params;
  },

  doQuery:function(){
    let params=this.buildQueryParams();
    let reportList=this.findPaged('personLocationReport',params,function(reportList){});
    this.getCurrentController().set("reportList", reportList);
  },

  setupController:function(controller,model){
    this.store.query("employee", {filter:{"forTenant":"1"}}).then(function(employeeList) {
        controller.set("employeeList", employeeList);
    });
    this.store.query("room", {filter:{"forTenant":"1"}}).then(function(roomList) {
        controller.set("roomList", roomList);
    });
    this.store.query("worktimesetting", {filter:{"forTenant":"1"}}).then(function(workTimeList) {
        controller.set("workTimeList", workTimeList);
    });
    controller.set("countWorkTime",1);
    this.doQuery();
    this._super(controller,model);
  }
});
