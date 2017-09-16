import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  pageSize: 3,
  model(){
    return {};
  },
  doQuery:function(){
    var _self = this;
    console.log('in doQuery');
    var params = this.buildParams();
    // var oldList = this.getCurrentController().get('workOrderList');
    var oldorder = this.getCurrentController().get('workOrder');
    if(oldorder){oldorder.set('choosecolor',false);}//设置上一工单中的已选中为不选中
    var workOrderList = this.findPaged('workorder',params,function(list){
      console.log("page callback in:",list);
      var workorder = list.get('firstObject');
      console.log('firstObjectget in route ',workorder);
      _self.getCurrentController().send('displayDetail',workorder);
    });
    console.log('workOrderList gett in doquery',workOrderList);
    _self.getCurrentController().set('workOrderList',workOrderList);
  },
  buildParams:function(){
    var _self = this;
    var curController = this.getCurrentController();
    var curUser = this.get("global_curStatus").getUser();
    var curTask = this.get("global_curStatus").getTask().get('task');
    var params = this.pagiParamsSet();
    var filter = {};
    filter = $.extend({},filter,{header:{id:curUser.get('id')},task:{id:curTask.get('id')}});
    if(curController && curController.get('ordername')){
      var ordername = curController.get('ordername');
      filter = $.extend({}, filter, {'customer':{'name@$like@$or1':ordername}});
      filter = $.extend({}, filter, {'title@$like@$or1':ordername});
    }
    if(curController && curController.get('status')){
      var value = curController.get('status');
      // if(value === '-1'){}//全部
      // else {
      console.log('value in odfawenw',value);
        filter = $.extend({},filter,{isSuccess:value.id});
      // }
    }
    if(curController && (curController.get('a') || curController.get('b'))){
      var a = curController.get('a');
      var b = curController.get('b');
      filter = $.extend({},filter,{'updateTime@$lte':a,'updateTime@$gte':b});
    }
    var sort={updateTime:'desc'};
    params.sort = sort;
    params.filter = filter;
    return params;
  },
  setupController:function(controller,model){
    this._super(controller,model);
    var _self = this;
    controller.set('status',null);//
    var curtask = this.get("global_curStatus").getTask().get('task');
    var curuser = this.get('global_curStatus').getUser();
    if(curuser && curuser.get('id')){
      controller.set('curuser',curuser);
    }
    if(curtask && curtask.get('id')){
      controller.set('curtask',curtask);
      this.set('header_title',curtask.get('title'));
      _self.doQuery();
    }
  },
  actions:{
    refreshroute(){
      this.refresh();
    },
    findQuery(){
      this.doQuery();
    }
  }
});
