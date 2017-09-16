import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataService: Ember.inject.service("date-service"),
    dataLoader: Ember.inject.service("data-loader"),
    header_title: '活动信息',
    model() {
        return {};
    },
    buildQueryParams: function() {
        var params = this.pagiParamsSet();
        var curController = this.getCurrentController();
        var filter = {
          type:4,
        };
        var sort;
        if (curController) {
            //按活动来查
            var customer=curController.get('customer');
            console.log("customer init:",customer);
            var customerId=curController.get('customerId');
            console.log("customerId init:",customerId);
            if(customerId){
              var staffObj = this.get("dataLoader").findStaff(customerId);
              console.log("staffObj init:",staffObj);
              var userId = staffObj.get("staff").get("id");
              console.log("userId init:",userId);
            //var activityId=curController.get('activityId');
              filter = $.extend({}, filter, {
                  toUser:{id:userId}
              });
            }
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
                    'createTime@$gte': compareDate
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
                    'createTime@$gte': beginCompare
                }, {
                    'createTime@$lte': endCompare
                });
            }
        }
        params.filter = filter;
        sort = {
            createTime : 'desc',
        };
        params.sort = sort;
        return params;
    },
    doQuery: function() {
        var params = this.buildQueryParams();
        console.log("params is", params);
        var messageList = this.findPaged('message', params, function(messageList) {});
        this.getCurrentController().set("messageList", messageList);
    },
    setupController: function(controller, model) {
        controller.set('customer', null);
        controller.set('customerId', null);
        controller.set("beginDate", null);
        controller.set("endDate", null);
        controller.set("queryCondition", null);
        this.doQuery();
        //var queryCondition = controller.get('input');
        //controller.set('queryCondition', queryCondition);
        this._super(controller, model);
        this.store.query('customer',{}).then(function(customerList){
          customerList.forEach(function(obj){
            obj.set('namePinyin',obj.get('title'));
          });
          controller.set('customerList',customerList);
        });
    }
});
