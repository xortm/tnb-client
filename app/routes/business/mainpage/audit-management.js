import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'账单列表',
  dateService:Ember.inject.service('date-service'),
  billTypeID:'',
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={billStatus:{typecode:'billStatus1'}};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'[customer][name@$like]@$or1':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
        'createDateTime':'desc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var billList=this.findPaged('customerbill',params,function(billList){});
    this.getCurrentController().set("billList", billList);
    this.getCurrentController().set('billTab',true);
    this.getCurrentController().set('rechargeTab',false);

  },
  buildQueryParamsRecharge() {
      var _self = this;
      var params = this.pagiParamsSet();
      var curController = this.getCurrentController();
      var filter = {rechargeStatus:{typecode:'rechargeStatus1'}};
      var sort;
      if (curController) {
          var queryCondition = curController.get('queryCondition');
          var dateQueryCondition = curController.get('dateQueryCondition');
          if (curController.get('queryCondition')) {
              filter = $.extend({}, filter, {
                  '[rechargeAccount][customer][name@$like]@$or1': curController.get('queryCondition')
              });
          }
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
                  'createDateTime@$gte': compareDate
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
                  'createDateTime@$gte': beginCompare
              }, {
                  'createDateTime@$lte': endCompare
              });
          }
      }
      params.filter = filter;
      sort = {
          '[createDateTime]': 'desc',
      };
      params.sort = sort;
      return params;
  },
  doQueryRecharge: function() {
      var params = this.buildQueryParamsRecharge();
      var rechargeList = this.findPaged('rechargerecord', params, function(rechargeList) {});
      this.getCurrentController().set("rechargeList", rechargeList);
      this.getCurrentController().set('rechargeTab',true);
      this.getCurrentController().set('billTab',false);

  },
  actions:{
    search:function(){
      if(this.getCurrentController().get('rechargeTab')){
        this.doQueryRecharge();
      }else if(this.getCurrentController().get('billTab')){
        this.doQuery();
      }
    },
  },
  setupController: function(controller,model){
    this._super(controller,model);
    if(controller.get('rechargeTab')){
      this.doQueryRecharge();
      Ember.run.schedule("afterRender",function(){
        $("#billTab").removeClass('active');
        $("#rechargeTab").addClass('active');
      });
    }else if(controller.get('billTab')){
      this.doQuery();
      Ember.run.schedule("afterRender",function(){
        $("#billTab").addClass('active');
        $("#rechargeTab").removeClass('active');
      });
    }
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);



  }
});
