import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  dataService: Ember.inject.service("date-service"),
  model: function() {
    return {};
  },
  buildQueryParams: function() {
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter = {};
    if (!curController) {
      return params;
    }
    var queryStr = curController.get("queryStr");
    if (queryStr) {
      filter = $.extend(filter, {
        '[customer][bed][room][name@$like]@$or1': queryStr
      }, {
        '[customer][bed][name@$like]@$or1': queryStr
      }, {
        '[customer][name@$like]@$or1': queryStr
      });
    }
    if (curController.get("inLeaving")) {
      filter.status = 1;
    }
    //时间条件搜索
    var dateQueryCondition = curController.get('dateQueryCondition');
    if (dateQueryCondition) {
      var compareDate = null;
      if (dateQueryCondition === "today") {
        compareDate = this.get("dataService").getTodayTimestamp();
      }
      if (dateQueryCondition === "seven") {
        compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
      }
      if (dateQueryCondition === "thirty") {
        compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
      }
      filter = $.extend({}, filter, {
        'createTime@$gte': compareDate
      });
    }
    //自定义日期搜索
    var conBeginDate = curController.get("beginDate");
    var conEndDate = curController.get("endDate");
    if (conBeginDate && conEndDate) {
      var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
      var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
      filter = $.extend({}, filter, {
        'createTime@$gte': beginCompare
      }, {
        'createTime@$lte': endCompare
      });
    }
    params.filter = filter;
    params.sort = {
      "startTime": "desc"
    };
    return params;
  },
  doQuery: function() {
    var self = this;
    var controller = this.getCurrentController();
    let params = this.buildQueryParams();
    let leaveList = this.findPaged('customer-leave', params, function(leaveList) {
      leaveList.forEach(function(leave) {
        var customer = leave.get("customer");
        var bed = customer.get("bed");
        var bedList = self.get('global_dataLoader.allBedList');
        if (bedList) {
          var bedChange = bedList.findBy("id", bed.get("id"));
          leave.set("customer.bed", bedChange);
        }
      });
    });
    controller.set("leaveList", leaveList);
  },
  setupController: function(controller, model) {
    controller.set("inLeaving", false);
    this.doQuery();
    this._super(controller, model);
  }
});
