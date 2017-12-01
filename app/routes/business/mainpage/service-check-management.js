import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  dataService:Ember.inject.service('date-service'),
  header_title:'检查列表',
  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'[staff][name@$like]':curController.get('queryCondition')});
        }
    }
    if(this.get('itemID')){
      filter = $.extend({}, filter, {'[item][id]':this.get('itemID')});
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
            'createDateTime@$gte': compareDate
        });
    }
    //自定义日期搜索
    var conBeginDate = curController.get("beginDate");
    var conEndDate = curController.get("endDate");
    if (conBeginDate && conEndDate) {
        var beginCompare = this.get("dataService").getFirstSecondStampOfDay(conBeginDate);
        var endCompare = this.get("dataService").getLastSecondStampOfDay(conEndDate);
        filter = $.extend({}, filter, {
            'createDateTime@$gte': beginCompare
        }, {
            'createDateTime@$lte': endCompare
        });
    }
    params.filter = filter;
    sort = {createDateTime:'desc'};
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    var serviceCheckList = this.findPaged('servicecheck',params,function(serviceCheckList){

    });
    _self.getCurrentController().set("serviceCheckList", serviceCheckList);
    _self.getCurrentController().set("itemID",'');
  },
  actions:{
    serviceItemSelect(serviceItem){
      if(serviceItem){
        this.set('itemID',serviceItem.get('id'));
      }else{
        this.set('itemID','');
      }
      this.doQuery();
    }
  },
  setupController: function(controller,model){
    this.set('itemID','');
    this.doQuery();
    let queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
  }
});
