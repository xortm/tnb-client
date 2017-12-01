import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '采购管理',
    model() {
        return {};
    },
    buildQueryParams() {
        var _self = this;
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            var queryCondition = curController.get('queryCondition');
            var dateQueryCondition = curController.get('dateQueryCondition');
            if (curController.get('queryCondition')) {
                filter = $.extend({}, filter, {
                    '[goods][name@$like]@$or1': curController.get('queryCondition')
                });
            }
            if (dateQueryCondition) {
                var compareDate = null;
                let nowTime = this.get("dataService").getTodayLastTimestamp();
                if (dateQueryCondition === "today") {
                    compareDate = this.get("dataService").getTodayTimestamp();
                    filter = $.extend({}, filter, {
                        'purchaseTime@$gte': compareDate
                    }, {
                        'purchaseTime@$lte': nowTime
                    });
                }
                if (dateQueryCondition === "seven") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
                    filter = $.extend({}, filter, {
                        'purchaseTime@$gte': compareDate
                    }, {
                        'purchaseTime@$lte': nowTime
                    });
                }
                if (dateQueryCondition === "thirty") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
                    filter = $.extend({}, filter, {
                        'purchaseTime@$gte': compareDate
                    }, {
                        'purchaseTime@$lte': nowTime
                    });
                }

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
                    'purchaseTime@$gte': beginCompare
                }, {
                    'purchaseTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[purchaseTime]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        var purchasegoodList = this.findPaged('purchasegood', params, function(purchasegoodList) {});
        this.getCurrentController().set("purchasegoodList", purchasegoodList);
    },
    setupController: function(controller, model) {
      this.doQuery();
      this._super(controller, model);
      var queryCondition = controller.get('input');
      controller.set('queryCondition', queryCondition);
    }
});
