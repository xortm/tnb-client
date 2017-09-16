import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {callStatus_callWait,callStatus_callFailure,callStatus_calling,callStatus_inCall,callStatus_callEnd,callStatus_callLost,callType_callOprDial} = Constants;

export default BaseBusiness.extend(Pagination,{
  header_title: "设置",
  model() {
    return {};
  },
  doQuery: function(){
    var _self = this;
    var userTask = this.get("global_curStatus").getTask();
    var curTask = userTask.get('task');
    if(!curTask||!curTask.get("id")){
      return ;
    }
    this.set('header_title',curTask.get("title"));
    var params = this.buildQueryParams();
    if(this.getCurrentController().get('csStatus')===0) {
      this.get("global_ajaxCall").set("action","toBeDialed");
    }
    else {
      this.get("global_ajaxCall").set("action","");
    }
    var customerList = this.findPaged('cs-customer',params,function(customerList){
      var call = _self.get("global_curStatus").getCall();
        customerList.forEach(function(csCustomer) {
          csCustomer.get('customer').set('callStatus','fa-phone');
          if(call&&call.get('customer')&&(call.get('customer').get('id') === csCustomer.get('customer').get('id'))) {
            var typeCode = call.get('status').get('typecode');
            if(typeCode === callStatus_calling||typeCode === callStatus_callWait) {
              csCustomer.get('customer').set('callStatus','fa-phone icon-shine');
            }
            else if (typeCode === callStatus_inCall) {
              csCustomer.get('customer').set('callStatus','fa-phone icon-red');
            }
          }
        });
    });
    var curController = this.getCurrentController();
    curController.set("curTask",curTask);
    curController.set("curUserTask",userTask);
    curController.set("customerList",customerList);
  },
  buildQueryParams: function(){
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    var curUser = this.get("global_curStatus").getUser();
    var curTask = this.get("global_curStatus").getTask().get('task');
    var filter = {cs:{id:curUser.get("id")}};
    var csStatus = 0;
    if(curController){
      console.log("csStatus is:" + curController.get("csStatus"));
    }
    if(curController&&curController.get("csStatus")===1){
      console.log("need 1");
      csStatus = 1;
    }
    filter = $.extend({}, filter, {status:csStatus});
    // filter = $.extend({}, filter, {status:csStatus});
    if(curController&&curController.get("searchValue")){
      // 处理查询条件，手机号或者姓名
      filter = $.extend({}, filter, {customer:{task:{id:curTask.get('id')},'name@$or1$like':curController.get('searchValue'),'phone@$or1$like':curController.get('searchValue')}});
    }
    else {
      filter = $.extend({}, filter, {customer:{task:{id:curTask.get('id')}}});
    }
    params.filter = filter;
    console.log("params is:",params);
    return params;
  },

  //设置controller信息，不再单独建立controller文件
  setupController: function(controller,model){
    var csStatus = controller.get('csStatus');
    this._super(controller, model);
    if(csStatus) {
      controller.set('csStatus',csStatus);
    }
    else {
      controller.set('csStatus',0);
    }
    this.doQuery();
    this.defineController(controller,model);
    console.log("controller in",controller);
  },

  defineController: function(controller,model){
    var _self = this;
    controller.reopen({
      // csStatus: 0,//默认显示待拨号
      actions:{
        searchCustomer: function() {
          _self.doQuery();
        },
        //切换状态查询
        switchMode:function(status) {
          this.set("csStatus",status);
          _self.doQuery();
        },

        // 关闭客户信息模态框
        cancelCustomerChange:function() {
          this.set('showpopCustomerModal',false);
        },

        // 查看客户详情
        checkCustomer:function(customer) {
          this.set('curEditCustomer',customer);
          this.set("showpopCustomerModal",true);

        },

        isFinished:function(csCustomerId) {
          this.set('confirmIdModal',csCustomerId);
        },

        // 状态切换
        switchStatus:function(csCustomerId) {
          var self = this;
          this.store.findRecord('cs-customer',csCustomerId).then(function(csCustomer) {
            csCustomer.set('status',1);
            csCustomer.save().then(function() {
              self.set('confirmIdModal',false);
              _self.refresh();
            });
          });
        },
      }
    });
    controller.setProperties(model);
  },
});
