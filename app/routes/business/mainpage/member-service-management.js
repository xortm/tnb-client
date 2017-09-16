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
      var queryCondition = curController.get('queryCondition');
      console.log('route:queryCondition',queryCondition);
      if (curController.get('queryCondition')){
        filter = $.extend({}, filter, {'[itemProject][project][customer][name@$like]@$like@$or1':curController.get('queryCondition')});
        //filter = $.extend({}, filter, {'[detail][customer][name@$like]@$or1': curController.get('queryCondition')});
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
    var params=this.buildQueryParams();
    var planExeList=this.findPaged('nursingplanexe',params,function(planExeList){});
    this.getCurrentController().set("planExeList", planExeList);
  },
  setupController: function(controller,model){
    controller.set('timeCondition', null);
    controller.set("beginDate", null);
    controller.set("endDate", null);
    controller.set("queryCondition", null);
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
  }
});
