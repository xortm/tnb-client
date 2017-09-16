import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  model() {
    return {};
  },
  dataService: Ember.inject.service("date-service"),
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
        var timeCondition = curController.get('timeCondition');
        if (timeCondition) {
            var compareDate = null;
            if (timeCondition === "today") {
                compareDate = this.get("dataService").getTodayTimestamp();
            }
            if (timeCondition === "seven") {
                compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
            }
            if (timeCondition === "thirty") {
                compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
            }
            filter = $.extend({}, filter, {
                'inTime@$gte': compareDate
            });
        }
        //自定义日期搜索
        var conBeginDate = curController.get("beginDate");
        var conEndDate = curController.get("endDate");
        if (conBeginDate && conEndDate) {
            var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
            var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
            filter = $.extend({}, filter, {
                'inTime@$gte': beginCompare
            }, {
                'inTime@$lte': endCompare
            });
        }
      }
      params.filter = filter;
      params.sort={
        "inTime":'desc',
      };
      return params;
  },

  doQuery:function(){
    let params=this.buildQueryParams();
    let reportList=this.findPaged('person-location-io-report',params,function(reportList){});
    this.getCurrentController().set("reportList", reportList);
  },

  setupController:function(controller,model){
    this._super(controller,model);
    this.store.query("employee", {filter:{"forTenant":"1"}}).then(function(employeeList) {
        controller.set("employeeList", employeeList);
    });
    this.store.query("room", {filter:{"forTenant":"1"}}).then(function(roomList) {
        controller.set("roomList", roomList);
    });
    this.doQuery();
  }
});
