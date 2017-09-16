import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  dataService: Ember.inject.service("date-service"),
  header_title:'预定管理',
  model() {
    return {};
  },
  buildQueryParams(str){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter;
    if(str=='all'){
      filter = {status:{typecode:'consultStatus3'}};
    }else{
      filter = {status:{typecode:'consultStatus3'},orderStatus:{typecode:'orderStatus1'}};
    }
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'[customer][name@$like]@$or2---1':curController.get('queryCondition')});
          filter = $.extend({}, filter, {'[customer][phone@$like]@$or2---2':curController.get('queryCondition')});
        }
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
            'orderDate@$gte': compareDate
        });
    }
    //自定义日期搜索
    var conBeginDate = curController.get("beginDate");
    var conEndDate = curController.get("endDate");
    if (conBeginDate && conEndDate) {
        var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
        var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
        filter = $.extend({}, filter, {
            'orderDate@$gte': beginCompare
        }, {
            'orderDate@$lte': endCompare
        });
    }
    params.filter = filter;
    sort = {
      createDateTime:'desc'
    };
    params.sort = sort;
    return params;
  },
  doQuery(){
    let _self = this;
    var params=this.buildQueryParams();
    let flowList = this.findPaged('customerbusinessflow',params,function(flowList){
    });
    this.getCurrentController().set("flowList", flowList);
  },
  doQueryAll(){
    let _self = this;
    var params=this.buildQueryParams('all');
    let flowList = this.findPaged('customerbusinessflow',params,function(flowList){
    });
    this.getCurrentController().set("flowList", flowList);
  },
  setupController(controller,model){
    if(controller.get('queryAll')){
      controller.send('queryAll');
    }else{
      this.doQuery();
    }
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);

  }
});
