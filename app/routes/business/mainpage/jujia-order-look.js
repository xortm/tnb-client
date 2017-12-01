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
    if(curController.get('defaultEmployee')){
      //员工姓名搜索
      filter = $.extend({}, filter, {'[serviceOperater][id]':curController.get('defaultEmployee.id')});
      console.log('search name:',curController.get('defaultEmployee.name'));
    }
    var queryStr = curController.get("queryStr");
    if (queryStr) {
      filter = $.extend(filter, {
        '[customer][name@$like]@$or1': queryStr
      });
    }
    let selectTypecode = curController.get("selectTypecode");
    //如果不是查全部，拼接筛选条件
    if(selectTypecode == "all"){
      filter = $.extend({}, filter, {
        'serviceStatus@$isNotNull':'null',
      });
    }else{
      filter = $.extend({}, filter, {
        serviceStatus:{
          typecode:selectTypecode,
        }
      });
    }

    //时间条件搜索
    var dateQueryCondition = curController.get('dateQueryCondition');
    console.log("dateQueryCondition:",dateQueryCondition);
    if (dateQueryCondition) {
      var compareDate = null;
      let today = this.get("dataService").getLastSecondStampOfDay(new Date());

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
        'createDateTime@$gte': compareDate,
        'createDateTime@$lte': today
      });
    }
    //自定义日期搜索
    var conBeginDate = curController.get("beginDate");
    var conEndDate = curController.get("endDate");
    if (conBeginDate && conEndDate) {
      var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
      var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
      filter = $.extend({}, filter, {
        'createDateTime@$gte': beginCompare
      }, {
        'createDateTime@$lte': endCompare
      });
    }
    params.filter = filter;
    params.sort = {
      "createDateTime": "desc"
    };
    return params;
  },
  doQuery: function() {
    var self = this;
    var controller = this.getCurrentController();
    let params = this.buildQueryParams();
    self.get('global_ajaxCall').set('action','jujia');
    let nursingplandetailList = this.findPaged('nursingplandetail', params, function(nursingplandetailList) {
    });
    console.log("nursingplandetailList:",nursingplandetailList);
    controller.set("nursingplandetailList", nursingplandetailList);
  },
  setupController: function(controller, model) {
    controller.set("selectTypecode", "all");
    this.doQuery();
    let employeeList = this.get("global_dataLoader").get("employeeSelecter");
    employeeList.forEach(function(employee) {
      employee.set('employeePinyin', employee.get("name"));
    });
    controller.set('employeeList',employeeList);
    this._super(controller, model);
  }
});
