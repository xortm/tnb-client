import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
//const {bizTypeWithdra_wash} = Constants;
export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '评估问卷',
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
                // filter = $.extend({}, filter, {'[customer][bed][room][name@$like]@$like@$or1':curController.get('queryCondition')});
                //filter = $.extend({}, filter, {'[customer][bed][name@$like]@$like@$or1':curController.get('queryCondition')});
                filter = $.extend({}, filter, {'[customer][cardCode@$like]@$or1': curController.get('queryCondition')});
                filter = $.extend({}, filter, {'[customer][name@$like]@$or1': curController.get('queryCondition')});
                // filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or2---1':'customerStatusIn'});
                // filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or2---2':'customerStatusTry'});
                // filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or2---3':'customerStatus0'});
            // }else {
            //   filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or1---1':'customerStatusIn'});
            //   filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or1---2':'customerStatusTry'});
            //   filter = $.extend({}, filter, {'[customer][customerStatus][typecode@$like]@$or1---3':'customerStatus0'});
            }
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
                    'createDateTime@$gte': compareDate
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
                    'createDateTime@$gte': beginCompare
                }, {
                    'createDateTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[createDateTime]': 'desc',
        };
        params.sort = sort;
        console.log("params is:", params);
        return params;
    },
    doQuery: function() {
        //alert("查数据");
        var _self = this;
        console.log('defaultCallaaaaaa');
        var params = this.buildQueryParams(); //拼查询条件
        var evaluateList = this.findPaged('evaluatebatch', params, function(evaluates) {
            evaluates.forEach(function(evaluate) {
                //_self.getCurrentController().query(evaluate);
            });
        });
        this.getCurrentController().set("evaluateList", evaluateList);
        console.log("evaluateList is", evaluateList);
    },
    actions: {
        // search: function(flag) {
        //     this.getCurrentController().set("dateQueryCondition", flag);
        //     this.get("controller").set("beginDate", null);
        //     this.get("controller").set("endDate", null);
        //     this.doQuery();
        // },
        // showDate: function() {
        //     this.get("controller").set('dateShow', true);
        // },
        // //隐藏时间选择器
        // hideDate: function() {
        //     this.get("controller").set('dateShow', false);
        //     this.doQuery();
        // },
    },
    setupController(controller, model) {
        controller.set('dateQueryCondition', null);
        controller.set("beginDate", null);
        controller.set("endDate", null);
        controller.set("queryCondition", null);
        this.doQuery();
        var queryCondition = controller.get('input');
        controller.set('queryCondition', queryCondition);
        controller.set("dateQueryCondition", "");
        this._super(controller, model);
    }
});
