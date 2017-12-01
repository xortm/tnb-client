import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '交接班信息',
    //bedTypeID:'',
    model() {
        return {};
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
          //待交接班数据
            filter = $.extend({}, filter, {
                'receiver@$isNotNull@$or2': 'null'
            });
            filter = $.extend({}, filter, {
                'remark@$isNotNull@$or2': 'null'
            });
            filter = $.extend({}, filter, {
                '[status][typecode@$like]@$or1---1': 'workDeliveryStatus2'
            });
            filter = $.extend({}, filter, {
                '[status][typecode@$like]@$or1---2': 'workDeliveryStatus3'
            });
            //接班人 交班人
            if (curController.get('sendStaff')) {
                filter = $.extend({}, filter, {
                    '[sender][name]': curController.get('sendStaff.name')
                });
            }
            if (curController.get('receiveStaff')) {
                filter = $.extend({}, filter, {
                    '[receiver][name]': curController.get('receiveStaff.name')
                });
            }
            //时间条件搜索
            var timeConditionSend = curController.get('timeConditionSend');
            if (timeConditionSend) {
                var compareDate = null;
                if (timeConditionSend === "today") {
                    compareDate = this.get("dataService").getTodayTimestamp();
                }
                if (timeConditionSend === "seven") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
                }
                if (timeConditionSend === "thirty") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
                }
                filter = $.extend({}, filter, {
                    'createDateTime@$gte': compareDate
                });
                console.log("compareDateS is", compareDate);
            }
            //自定义日期搜索
            var conBeginDate = curController.get("beginDate");
            console.log("++++conBeginDateS+++++", conBeginDate);
            var conEndDate = curController.get("endDate");
            console.log("++++conEndDateS+++++", conEndDate);
            if (conBeginDate && conEndDate) {
                var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
                console.log("beginCompareS is", beginCompare);
                var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
                console.log("endCompareS is", endCompare);
                filter = $.extend({}, filter, {
                    'createDateTime@$gte': beginCompare
                }, {
                    'createDateTime@$lte': endCompare
                });
            }
            var timeConditionReceive = curController.get('timeConditionReceive');
            if (timeConditionReceive) {
                var compareDate2 = null;
                if (timeConditionReceive === "today") {
                    compareDate2 = this.get("dataService").getTodayTimestamp();
                }
                if (timeConditionReceive === "seven") {
                    compareDate2 = this.get("dataService").getDaysBeforeTimestamp(7);
                }
                if (timeConditionReceive === "thirty") {
                    compareDate2 = this.get("dataService").getDaysBeforeTimestamp(30);
                }
                filter = $.extend({}, filter, {
                    'createDateTime@$gte': compareDate2
                });
                console.log("compareDateR is", compareDate2);
            }
            var conBeginDate2 = curController.get("beginDateR");
            console.log("++++conBeginDateR+++++", conBeginDate2);
            var conEndDate2 = curController.get("endDateR");
            console.log("++++conEndDateR+++++", conEndDate2);
            if (conBeginDate2 && conEndDate2) {
                var beginCompare2 = this.get("dataService").getFirstSecondStampOfDay(conBeginDate2);
                console.log("beginCompareR is", beginCompare2);
                var endCompare2 = this.get("dataService").getLastSecondStampOfDay(conEndDate2);
                console.log("endCompareR is", endCompare2);
                filter = $.extend({}, filter, {
                    'receiveTime@$gte': beginCompare2
                }, {
                    'receiveTime@$lte': endCompare2
                });
            }
        }
        params.filter = filter;
        sort = {
            createDateTime: 'desc'
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        var workdeliveryList = this.findPaged('workdelivery', params, function(workdeliveryList) {});
        this.getCurrentController().set("workdeliveryList", workdeliveryList);

    },
    actions: {
        search: function(flag) {
            //alert("执行了");
            this.getCurrentController().set("queryCondition", flag);
            this.get("controller").set("beginDate", null);
            this.get("controller").set("endDate", null);
            this.doQuery();
        },
        //显示时间选择器
        showDate: function() {
            this.get("controller").set('dateShow', true);
        },
        //隐藏时间选择器
        hideDate: function() {
            this.get("controller").set('dateShow', false);
            this.doQuery();
        },
    },

    setupController: function(controller, model) {
        this.doQuery();
        this._super(controller, model);
        //查询所有的员工信息
        this.store.query('employee', {
            filter: {
                staffStatus: {
                    typecode: 'staffStatusIn'
                }
            }
        }).then(function(employeeList) {
            employeeList.forEach(function(staff) {
                staff.set('sortName', pinyinUtil.getFirstLetter(staff.get("name")));
            });
            controller.set('employeeList', employeeList);
        });
    }
});
