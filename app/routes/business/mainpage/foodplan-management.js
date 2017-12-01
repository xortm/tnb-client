import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    dataLoader:Ember.inject.service('data-loader'),
    feedBus:Ember.inject.service('feed-bus'),
    header_title: '订餐管理',
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
            var dateQueryCondition = curController.get('dateQueryCondition');
            if (dateQueryCondition) {
                var compareDate = null;
                let nowTime = this.get("dataService").getTodayLastTimestamp();
                if (dateQueryCondition === "today") {
                    compareDate = this.get("dataService").getTodayTimestamp();
                    filter = $.extend({}, filter, {
                        'queryStartDate': compareDate
                    }, {
                        'queryEndDate': nowTime
                    });
                }
                if (dateQueryCondition === "seven") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
                    filter = $.extend({}, filter, {
                        'queryStartDate': compareDate
                    }, {
                        'queryEndDate': nowTime
                    });
                }
                if (dateQueryCondition === "thirty") {
                    compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
                    filter = $.extend({}, filter, {
                        'queryStartDate': compareDate
                    }, {
                        'queryEndDate': nowTime
                    });
                }
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
                    'queryStartDate': beginCompare
                }, {
                    'queryEndDate': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            '[diningDate]': 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        var foodplanList = this.findPaged('customerdayfoodplan', params, function(foodplanList) {});
        this.getCurrentController().set("foodplanList", foodplanList);
    },
    setupController: function(controller, model) {
      let _self = this;
      this._super(controller, model);
      //提前将所有的食物列表放入全局
      this.store.query('food',{}).then(function(foodList){
        _self.set('feedBus.allFoodList',foodList);
      });
      let foodTimeList = this.get('dataLoader').findDictList('foodTimeType');
      controller.set('foodTimeList',foodTimeList);
      this.doQuery();
    }
});
