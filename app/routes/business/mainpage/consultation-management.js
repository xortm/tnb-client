import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  queryParams: {
      saveConsult: {
          refreshModel: true
      }
  },
    dataService: Ember.inject.service("date-service"),
    header_title: '咨询管理',
    //bedTypeID:'',
    model() {
        return {};
    },
    buildQueryParams: function() {
      var _self = this;
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {};
        var sort;
        if (curController) {
          var queryCondition = curController.get('queryCondition');
          var dateQueryCondition = curController.get('dateQueryCondition');
          var dateQueryConditionAp = curController.get('dateQueryConditionAp');
          if (curController.get('queryCondition')) {
              filter = $.extend({}, filter, {'advName@$like@$or1':curController.get('queryCondition')});
              filter = $.extend({}, filter, {'advTel@$like@$or1':curController.get('queryCondition')});
              filter = $.extend({}, filter, {'[consultStatus][typecode@$like]@$or2---1':'consultStatus1'});
              filter = $.extend({}, filter, {'[consultStatus][typecode@$like]@$or2---2':'consultStatus2'});
              filter = $.extend({}, filter, {'advName@$isNotNull':'null'});
          }else {
            filter = $.extend({}, filter, {'[consultStatus][typecode@$like]@$or1---1':'consultStatus1'});
            filter = $.extend({}, filter, {'[consultStatus][typecode@$like]@$or1---2':'consultStatus2'});
            filter = $.extend({}, filter, {'advName@$isNotNull':'null'});
          }
            //按咨询时间条件搜索
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
                    'advDate@$gte': compareDate,
                });
                console.log("compareDate is",compareDate);
            }
            //自定义日期搜索-咨询日期
            var conBeginDate = curController.get("beginDate");
            console.log("++++conBeginDate+++++",conBeginDate);
            var conEndDate = curController.get("endDate");
            console.log("++++conEndDate+++++",conEndDate);
            if (conBeginDate && conEndDate) {
                var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
                console.log("beginCompare is",beginCompare);
                var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
                console.log("endCompare is",endCompare);
                filter = $.extend({}, filter, {
                    'advDate@$gte': beginCompare
                }, {
                    'advDate@$lte': endCompare
                });
            }
            //按预约参观日期查询
            if (dateQueryConditionAp) {
                var compareDateAp = null;
                if (dateQueryCondition === "today") {
                    compareDateAp = this.get("dataService").getTodayTimestamp();
                }
                if (dateQueryCondition === "seven") {
                    compareDateAp = this.get("dataService").getDaysBeforeTimestamp(7);
                }
                if (dateQueryCondition === "thirty") {
                    compareDateAp = this.get("dataService").getDaysBeforeTimestamp(30);
                }
                filter = $.extend({}, filter, {
                    'appointmentDate@$gte': compareDateAp,
                });
                console.log("compareDateAp is",compareDateAp);
            }
            //按自定义日期查询-预约日期
            var conBeginDateAp = curController.get("beginDateAp");
            console.log("++++conBeginDateAp+++++",conBeginDateAp);
            var conEndDateAp = curController.get("endDateAp");
            console.log("++++conEndDateAp+++++",conEndDateAp);
            if (conBeginDateAp && conEndDateAp) {
                var beginCompareAp = this.get("dataService").getFirstSecondStampOfDay(conBeginDateAp);
                console.log("beginCompareAp is",beginCompareAp);
                var endCompareAp = this.get("dataService").getLastSecondStampOfDay(conEndDateAp);
                console.log("endCompareAp is",endCompareAp);
                filter = $.extend({}, filter, {
                    'appointmentDate@$gte': beginCompareAp
                }, {
                    'appointmentDate@$lte': endCompareAp
                });
            }
        }
        params.filter = filter;
        sort={
          '[createDateTime]':'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        console.log("params is",params);
        var consultList = this.findPaged('consultinfo', params, function(consultList) {
        });
        this.getCurrentController().set("consultList", consultList);
        //计算跟进次数
        // this.store.query("backvist", {
        //     filter: {
        //     }
        // }).then(function(backvistList){
        // });
    },
    actions: {
      // search: function(flag) {
      //     //alert("执行了");
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
    setupController: function(controller, model) {
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    controller.set("dateQueryCondition", "");
    controller.set("dateQueryConditionAp", "");
    this._super(controller, model);
    console.log("saveConsult is",controller.get("saveConsult"));
    }
});
