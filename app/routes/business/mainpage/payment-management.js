import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  dataService: Ember.inject.service("date-service"),
  header_title:'扣费列表',
  bedTypeID:'',
  model() {
    return {};
  },
  buildQueryParams:function(){
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let filter={};
    let sort;
    let _self = this;
    if (curController) {
        if (curController.get('searchInput')) {
          filter = $.extend({}, filter, {'[payAccount][customer][name@$like]':curController.get('searchInput')});
        }
      }
        var timeCondition = curController.get('timeCondition');
        if (timeCondition) {
            let compareDate = null;
            if (timeCondition === "today") {
                compareDate = _self.get("dataService").getTodayTimestamp();
            }
            if (timeCondition === "seven") {
                compareDate = _self.get("dataService").getDaysBeforeTimestamp(7);
            }
            if (timeCondition === "thirty") {
                compareDate = _self.get("dataService").getDaysBeforeTimestamp(30);
            }
            filter = $.extend({}, filter, {
                'createDateTime@$gte': compareDate
            });
            console.log("compareDate is",compareDate);
        }
        //自定义日期搜索
        let conBeginDate = curController.get("beginDate");
        console.log("++++conBeginDate+++++",conBeginDate);
        let conEndDate = curController.get("endDate");
        console.log("++++conEndDate+++++",conEndDate);
        if (conBeginDate && conEndDate) {
            let beginCompare = _self.get("dataService").getFirstSecondStampOfDay(conBeginDate);
            console.log("beginCompare is",beginCompare);
            let endCompare = _self.get("dataService").getLastSecondStampOfDay(conEndDate);
            console.log("endCompare is",endCompare);
            filter = $.extend({}, filter, {
                'createDateTime@$gte': beginCompare
            }, {
                'createDateTime@$lte': endCompare
            });
          }


    params.filter = filter;
    sort = {
      createDateTime:'desc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let params=this.buildQueryParams();
    let tradeList=this.findPaged('tradedetail',params,function(tradeList){});
    this.getCurrentController().set("tradeList", tradeList);
  },


  setupController: function(controller,model){
    this.doQuery();
    let searchInput = controller.get('input');
    controller.set('searchInput', searchInput);
    this._super(controller,model);

  }
});
