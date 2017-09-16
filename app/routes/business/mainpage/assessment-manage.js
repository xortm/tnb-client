import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination, {
  header_title: '员工考核',
  dateService: Ember.inject.service('date-service'),
  model: function() {
    return {};
  },
  buildQueryParams: function() {
    var curController = this.getCurrentController();
    var params = this.pagiParamsSet();
    if (!curController) {
        return params;
    }
    var filter = {};
    if (curController.get("examiner")) {
      $.extend(filter, {
        "examiner": {
          "id": curController.get("examiner").get("id")
        }
      });
    }
    //时间条件搜索
    var dateQueryCondition = curController.get('dateQueryCondition');
    if (dateQueryCondition) {
      var compareDate = null;
      if (dateQueryCondition === "today") {
        compareDate = this.get("dateService").getTodayTimestamp();
      }
      if (dateQueryCondition === "seven") {
        compareDate = this.get("dateService").getDaysBeforeTimestamp(7);
      }
      if (dateQueryCondition === "thirty") {
        compareDate = this.get("dateService").getDaysBeforeTimestamp(30);
      }
      filter = $.extend({}, filter, {
        'examTime@$gte': compareDate
      });
    }
    //自定义日期搜索
    var conBeginDate = curController.get("beginDate");
    var conEndDate = curController.get("endDate");
    if (conBeginDate && conEndDate) {
      var beginCompare = this.get("dateService").getFirstSecondStampOfDay(new Date(conBeginDate));
      var endCompare = this.get("dateService").getLastSecondStampOfDay(new Date(conEndDate));
      filter = $.extend({}, filter, {
        'examTime@$gte': beginCompare
      }, {
        'examTime@$lte': endCompare
      });
    }
    params.sort={
      "examTime":"desc"
    };
    params.filter=filter;
    return params;
  },
  doQuery: function() {
    var params = this.buildQueryParams();
    var assessmentList = this.findPaged('assessment', params, function(assessmentList) {});
    this.getCurrentController().set("assessmentList", assessmentList);
  },
  setupController: function(controller, model) {
    this.store.query("employee", {filter:{"forTenant":"1"}}).then(function(employeeList) {
        controller.set("employeeList", employeeList);
    });
    this.doQuery();
    this._super(controller, model);
  }
});
