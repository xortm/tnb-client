import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '员工考勤',
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
          if(curController.get('curEmployee')){
            //员工姓名搜索
            filter = $.extend({}, filter, {'[employee][name]':curController.get('curEmployee.name')});
            console.log('search name:',curController.get('curEmployee.name'));
          }
            //时间条件搜索
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
                    'attendanceTime@$gte': compareDate
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
                    'attendanceTime@$gte': beginCompare
                }, {
                    'attendanceTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[attendanceTime]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        console.log("params is", params);
        var staffattendanceList = this.findPaged('staffattendance', params, function(staffattendanceList) {});
        this.getCurrentController().set("staffattendanceList", staffattendanceList);
    },
    actions: {
        search: function(flag) {
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
        //查询所有的客户信息
        this.store.query('employee', {filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(employeeList) {
            employeeList.forEach(function(employee) {
                employee.set('sortName', pinyinUtil.getFirstLetter(employee.get("name")));
            });
            controller.set('employeeList', employeeList);
        });
    }
});
