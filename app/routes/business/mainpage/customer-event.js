import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  model() {
    return {};
  },
  dataService: Ember.inject.service("date-service"),
  buildQueryParams:function(){
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let filter={};
    let _self = this;
    if (curController) {
      var customerId=curController.get('customerId');
      if(customerId){
        filter = $.extend({}, filter, {
            '[customer][id]': customerId
        });
      }
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
                'eventTime@$gte': compareDate
            });
        }
        //自定义日期搜索
        var conBeginDate = curController.get("beginDate");
        var conEndDate = curController.get("endDate");
        if (conBeginDate && conEndDate) {
            var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
            var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
            filter = $.extend({}, filter, {
                'eventTime@$gte': beginCompare
            }, {
                'eventTime@$lte': endCompare
            });
        }
      }
      params.filter = filter;
      params.sort={
        "eventTime":'desc',
      };
      return params;
  },

  doQuery:function(){
    let params=this.buildQueryParams();
    let eventList=this.findPaged('customer-event',params,function(eventList){});
    this.getCurrentController().set("eventList", eventList);
  },

  setupController:function(controller,model){
    this._super(controller,model);
    this.store.query('customer',{}).then(function(customerList){
      customerList.forEach(function(obj){
        obj.set('namePinyin',obj.get('name'));
      });
      controller.set('customerList',customerList);
    });
    this.doQuery();
  }
});
