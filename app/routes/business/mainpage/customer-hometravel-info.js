import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
    dataLoader: Ember.inject.service("data-loader"),
    header_title: '客户详情',
    queryParams: {
        id: {
            refreshModel: true
        }
    },
    model() {
        return {};
    },
    // queryCall: function(curCustomer) {
    //     var curUser = this.get("global_curStatus").getUser();
    //     var curTask = this.get("global_curStatus").getTask().get('task');
    //     return this.store.query("call", {
    //         sort: {
    //             createTime: 'desc'
    //         },
    //         filter: {
    //             agent: {
    //                 id: curUser.get('id')
    //             },
    //             customer: {
    //                 id: curCustomer.get('id')
    //             },
    //             task: {
    //                 id: curTask.get('id')
    //             }
    //         }
    //     });
    // },
    // doQuery: function() {
    //     var _self = this;
    //     var curController = this.getCurrentController();
    //     var curCustomer;
    //     var curCustomerCall;
    //     var curUser = this.get("global_curStatus").getUser();
    //     var userTask = this.get("global_curStatus").getTask();
    //     var curTask = userTask.get('task');
    //     if (!curTask || !curTask.get("id")) {
    //         return;
    //     }
    //     this.set('header_title', curTask.get("title"));
    //     var params = this.buildQueryParams();
    //     var customerList = this.findPaged('cs-customer', params, function(csCustomers) {
    //         csCustomers.forEach(function(csCustomer) {
    //             csCustomer.get('customer').set('click', false);
    //         });
    //         if (csCustomers.get('firstObject') && csCustomers.get('firstObject').get('customer')) {
    //             curCustomer = csCustomers.get('firstObject').get('customer');
    //             curCustomerCall = _self.queryCall(curCustomer);
    //             curCustomer.set('click', true);
    //         }
    //
    //         curController.set('curCustomer', curCustomer);
    //         curController.set('curCustomerCall', curCustomerCall);
    //         curController.set('curUser', curUser);
    //         curController.set('curTask', curTask);
    //         curController.set('curUserTask', userTask);
    //     });
    //     curController.set("csCustomerList", customerList);
    // },
    // buildQueryParams: function() {
    //     var params = this.pagiParamsSet();
    //     var curController = this.getCurrentController();
    //     var curUser = this.get("global_curStatus").getUser();
    //     var curTask = this.get("global_curStatus").getTask().get('task');
    //     var filter = {
    //         cs: {
    //             id: curUser.get('id')
    //         }
    //     };
    //     var sort = {
    //         createTime: 'desc'
    //     };
    //     if (curController && curController.get('customer')) {
    //         filter = $.extend({}, filter, {
    //             customer: {
    //                 task: {
    //                     id: curTask.get('id')
    //                 },
    //                 'name@$or1$like': curController.get('customer'),
    //                 'phone@$or1$like': curController.get('customer')
    //             }
    //         });
    //     } else {
    //         filter = $.extend({}, filter, {
    //             customer: {
    //                 task: {
    //                     id: curTask.get('id')
    //                 }
    //             }
    //         });
    //     }
    //     params.filter = filter;
    //     params.sort = sort;
    //     console.log("params is:", params);
    //     return params;
    // },
    buildQueryParams(){
      var _self = this;
      var params = this.pagiParamsSet();
      var filter = {};
      var curController = this.getCurrentController();
      // if (curController) {
      //     //时间条件搜索
      //     var queryCondition = curController.get('queryCondition');
      //     if (queryCondition) {
      //         var compareDate = null;
      //         if (queryCondition === "today") {
      //             compareDate = this.get("dataService").getTodayTimestamp();
      //         }
      //         if (queryCondition === "seven") {
      //             compareDate = this.get("dataService").getDaysBeforeTimestamp(7);
      //         }
      //         if (queryCondition === "thirty") {
      //             compareDate = this.get("dataService").getDaysBeforeTimestamp(30);
      //         }
      //         filter = $.extend({}, filter, {
      //             'examDateTime@$gte': compareDate
      //         });
      //     }
      //     //自定义日期搜索
      //     var conBeginDate = curController.get("beginDate");
      //     //console.log("++++conBeginDate+++++",conBeginDate);
      //     var conEndDate = curController.get("endDate");
      //     if (conBeginDate && conEndDate) {
      //         var beginCompare = this.get("dataService").getFirstSecondStampOfDayString(conBeginDate);
      //         var endCompare = this.get("dataService").getLastSecondStampOfDayString(conEndDate);
      //         filter = $.extend({}, filter, {
      //             'callTime@$gte': beginCompare
      //         }, {
      //             'callTime@$lte': endCompare
      //         });
      //     }
      // }
      params.filter = filter;
      return params;

    },
    doQuery: function(){
      var _self = this;
      var params = this.buildQueryParams();//拼查询条件
      // var healthList = this.findPaged('health-info',params,function(healthList){});
      // this.getCurrentController().set("healthList",healthList);
      //this.getCurrentController().set("itemtypeID",'');
    },
    actions: {
      saveRefresh: function() {
            this.refresh();
        },
    },
    setupController: function(controller, model) {
        this.doQuery();
        this._super(controller, model);
        //controller.set("params",{});
        controller.customerObs();
        var obj = this.get("dataLoader").findDict("bedStatusIdle");
        console.log("obj is", obj);
        var statusId = obj.get("id");
        console.log("statusId is", statusId);
        this.store.query('bed', {
            '[status][id]': this.get('statusId')
        }).then(function(bedList) {
            controller.set('bedList', bedList);
            console.log("bedList is",bedList);
        });
        // this.store.query("health-info",{}).then(function(healthList){
        //     controller.set("healthList",healthList);
        //     console.log("healthList is",healthList);
        // });
    },
});
