import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  dataService: Ember.inject.service("date-service"),
  header_title:'执行情况列表',
  bedTypeID:'',
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if(curController){
      if(curController.get('customer')){
        filter = $.extend({}, filter, {'[detail][customer][name@$or1]':curController.get('customer.name')});
        // filter = $.extend({}, filter, {'[itemProject][project][customer][name@$or1]':curController.get('customer.name')});
      }
      if(curController.get('staff')){
        filter = $.extend({}, filter, {'[exeStaff][name]':curController.get('staff.name')});
      }
      //时间搜索
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
              'exeStartTime@$gte': compareDate
          });
      }
      //自定义日期搜索
      var conBeginDate = curController.get("beginDate");
      var conEndDate = curController.get("endDate");
      if (conBeginDate && conEndDate) {
          var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
          var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
          filter = $.extend({}, filter, {
              'exeStartTime@$gte': beginCompare
          }, {
              'exeStartTime@$lte': endCompare
          });
      }
    }
    params.filter = filter;
    sort = {
      exeStartTime:'desc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    var planExeList=this.findPaged('nursingplanexe',params,function(planExeList){});
    this.getCurrentController().set("planExeList", planExeList);
  },
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);
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
    this.store.query('customer',{filterCustomer}).then(function(customerList){
      controller.set('customerList',customerList);
    });
    this.store.query('nursingplandetail',{}).then(function(planList){
      controller.set('planList',planList);
    });
    this.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(staffList){
      controller.set('staffList',staffList);
    });
  }
});
