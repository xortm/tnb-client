import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '护理日志信息',
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
          if(curController.get('nurscustomer')){
            filter = $.extend({}, filter, {'[nurscustomer][name]':curController.get('nurscustomer.name')});
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
                    'nursingDate@$gte': compareDate
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
                    'nursingDate@$gte': beginCompare
                }, {
                    'nursingDate@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[nurscustomer][name]':'desc',
            '[recordTime]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        var nursingList = this.findPaged('nursinglog', params, function(nursingList) {});
        this.getCurrentController().set("nursingList", nursingList);

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
        // bedSelect(bedSelect){
        //   this.set('bedTypeID',bedSelect.id);
        //   this.doQuery();
        // },
        // toAddPage(){
        //   this.set('detailEdit',true);
        //   var mainpageController = App.lookup('controller:business.mainpage');
        //   mainpageController.switchMainPage('warning-detail');
        // },
    },

    setupController: function(controller, model) {
        this.doQuery();
        // this.store.query('nursinglog',{}).then(function(nursingList){
        //   controller.set('nursingList',nursingList);
        // });
        this._super(controller, model);
        let filterCustomer;
        filterCustomer = $.extend({}, filterCustomer, {
            '[customerStatus][typecode@$like]@$or1---1': 'customerStatusIn'
        });
        filterCustomer = $.extend({}, filterCustomer, {
            '[customerStatus][typecode@$like]@$or1---2': 'customerStatusTry'
        });
        filterCustomer = $.extend({}, filterCustomer, {
            'addRemark@$not': 'directCreate'
        });
        //查询所有的客户信息
        this.store.query('customer', {filterCustomer}).then(function(customerList) {
            customerList.forEach(function(customer) {
                customer.set('sortName', pinyinUtil.getFirstLetter(customer.get("name")));
            });
            controller.set('customerList', customerList);
        });
    }
});
