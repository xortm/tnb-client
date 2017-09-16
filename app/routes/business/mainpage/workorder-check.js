import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  model(){
    return {};
  },
  doQuery:function(){
    console.log('in doQuery');
    var _self = this;
    var params = this.buildParams();
    var oldorder = this.getCurrentController().get('workOrder');
    if(oldorder){oldorder.set('choosecolor',false);}//设置上一工单中的已选中为不选中
    var workOrderList = this.findPaged('workorder',params);
    workOrderList.then(function(list){
      var workorder = list.get('firstObject');
      console.log('firstObjectget in route ',workorder);
      _self.getCurrentController().send('displayDetail',workorder);
    });
    console.log('workOrderList gett in doquery',workOrderList);
    this.getCurrentController().set('workOrderList',workOrderList);
  },
  buildParams:function(){
    var _self = this;
    var curController = this.getCurrentController();
    var curUser = this.get("global_curStatus").getUser();
    var curTask = this.get("global_curStatus").getTask();
    var params = this.pagiParamsSet();
    var filter = {};
    filter = $.extend({},filter,{task:{id:curTask.get('id')}});
    console.log('curControllerget',curController);
    if(curController && curController.get('ordername')){
      var ordername = curController.get('ordername');
      filter = $.extend({}, filter, {'customer':{'name@$like@$or1':ordername}});
      filter = $.extend({}, filter, {'title@$like@$or1':ordername});
    }
    if(curController && curController.get('status')){
      var value = curController.get('status');
      if(value === '-1'){}//全部
      else {
        console.log('value get in check ',value);
        filter = $.extend({},filter,{isSuccess:value.id});
      }
    }
    if(curController && (curController.get('a') || curController.get('b'))){
      var a = curController.get('a');
      var b = curController.get('b');
      filter = $.extend({},filter,{'createTime@$lte':a,'createTime@$gte':b});
    }
    var sort={tbcTime:'desc'};
    params.sort = sort;
    params.filter = filter;
    return params;
  },
  setupController:function(controller,model){
    this._super(controller,model);
    var _self = this;
    var curtask = this.get("global_curStatus").getTask();
    var curuser = this.get('global_curStatus').getUser();
    if(curuser && curuser.get('id')){
      controller.set('curuser',curuser);
    }
    if(curtask && curtask.get('id')){
      this.set('header_title',curtask.get('title'));
      console.log('curtaslffwae',curtask);
      controller.set('curtask',curtask);
      var params = _self.buildParams();
      _self.doQuery();
    }

  },
  actions:{
    refreshroute(){
      this.refresh();
    },
    findQuery(){
      this.doQuery();
    },
  }
});
