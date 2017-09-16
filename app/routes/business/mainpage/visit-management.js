import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
export default BaseBusiness.extend(Pagination, {
  queryParams: {
      id: {
          refreshModel: true
      },
  },
    dataService: Ember.inject.service("date-service"),
    header_title: '回访管理',
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
                    'createDateTime@$gte': compareDate
                });
                console.log("compareDate is",compareDate);
            }
            //自定义日期搜索
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
                    'createDateTime@$gte': beginCompare
                }, {
                    'createDateTime@$lte': endCompare
                });
            }
            //通过咨询表id查询回访
            var id = this.getCurrentController().get('id');
            if(id){
              filter = $.extend({}, filter, {
                       '[consultInfo][id]': id
                   });
            }
        }
        params.filter = filter;
        sort={
            '[createDateTime]':'asc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        console.log("params is",params);
        var vistList = this.findPaged('backvist', params, function(vistList) {});
        this.getCurrentController().set("vistList", vistList);
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
    }
});
