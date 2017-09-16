import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '反馈信息',
    model() {
        return {};
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            //按活动来查
            var customerId=curController.get('customerId');
            if(customerId){
              filter = $.extend({}, filter, {
                  '[customer][id]': customerId
              });
            }
            //时间条件搜索
            var queryCondition = curController.get('queryCondition');
            if (queryCondition) {
                var compareDate = null;
                if (queryCondition === "today") {
                    compareDate = this.get("dataService").getTodayTimestamp();
                }
                if (queryCondition === "seven") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
                }
                if (queryCondition === "thirty") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
                }
                filter = $.extend({}, filter, {
                    'createTime@$gte': compareDate
                });
                console.log("compareDate is", compareDate);
            }
            //自定义日期搜索
            var conBeginDate = curController.get("beginDate");
            console.log("++++conBeginDate+++++", conBeginDate);
            var conEndDate = curController.get("endDate");
            console.log("++++conEndDate+++++", conEndDate);
            if (conBeginDate && conEndDate) {
                var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
                console.log("beginCompare is", beginCompare);
                var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
                console.log("endCompare is", endCompare);
                filter = $.extend({}, filter, {
                    'createTime@$gte': beginCompare
                }, {
                    'createTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[createTime]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        console.log("params is", params);
        var feedbackList = this.findPaged('feedback', params, function(feedbackList) {});
        console.log('feedback length:',feedbackList.get('length'));
        console.log("feedbackList:",feedbackList);
        this.getCurrentController().set("feedbackList", feedbackList);
    },
    setupController: function(controller, model) {
      controller.set('customer', null);
      controller.set('customerId', null);
      controller.set("beginDate", null);
      controller.set("endDate", null);
      controller.set("queryCondition", null);
        this.doQuery();
        //var queryCondition = controller.get('input');
        //controller.set('queryCondition', queryCondition);
        this._super(controller, model);
        this.store.query('customer',{}).then(function(customerList){
          customerList.forEach(function(obj){
            obj.set('namePinyin',obj.get('name'));
          });
          controller.set('customerList',customerList);
        });
    }
});
