import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    header_title: '服务变更',

    model() {
        return {};
    },

    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
            var queryCondition = curController.get('queryCondition');
            if (curController.get('queryCondition')) {
                filter = $.extend({}, filter, {'[customer][bed][name@$like]@$like@$or1':curController.get('queryCondition')});
                filter = $.extend({}, filter, {'[customer][name@$like]@$or1': curController.get('queryCondition')});
            }
            //时间条件搜索
            var dateQueryCondition = curController.get('dateQueryCondition');
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
        return params;
    },
    doQuery: function() {
      let _self = this;
      var params = this.buildQueryParams();
      console.log("params is", params);
      var changeList = this.findPaged('customerserverchange', params, function(changeList) {
        changeList.forEach(function(change){
          let bedOldId = change.belongsTo("bedOld").id();
          let bedOld = _self.get("global_dataLoader.allBedList").findBy("id",bedOldId);
          change.set("bedOld",bedOld);
          let bedNewId = change.belongsTo("bedNew").id();
          let bedNew = _self.get("global_dataLoader.allBedList").findBy("id",bedNewId);
          change.set("bedNew",bedNew);
        });
      });
      this.getCurrentController().set("changeList", changeList);
    },
    actions: {
        // search: function(flag) {
        //     //alert("执行了");
        //     this.getCurrentController().set("dateQueryCondition", flag);
        //     this.get("controller").set("beginDate", null);
        //     this.get("controller").set("endDate", null);
        //     this.doQuery();
        // },
        // //显示时间选择器
        // showDate: function() {
        //     this.get("controller").set('dateShow', true);
        // },
        // //隐藏时间选择器
        // hideDate: function() {
        //     this.get("controller").set('dateShow', false);
        //     this.doQuery();
        // },
    },
    setupController: function(controller, model) {
        this.doQuery();
        var queryCondition = controller.get('input');
        controller.set('queryCondition', queryCondition);
        controller.set("dateQueryCondition", "");
        this._super(controller, model);
    }
});
