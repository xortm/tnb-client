import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '老人动态及预警信息',
    model() {
        return {};
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        console.log("warning-management1111", this.get("dataService"));
        if (curController) {
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
                    'callTime@$gte': compareDate
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
                    'callTime@$gte': beginCompare
                }, {
                    'callTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[callTime]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        var warningList = this.findPaged('hbeaconwarning', params, function(warningList) {});
        this.getCurrentController().set("warningList", warningList);
    },
    setupController: function(controller, model) {
        this.doQuery();
        this._super(controller, model);
    }
});
