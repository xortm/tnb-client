import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'硬件方案列表',
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
          filter = $.extend({}, filter, {'deviceName@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
        '[deviceName]': 'asc',
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var deviceList=this.findPaged('devicetype',params,function(deviceList){});
    this.getCurrentController().set("deviceList", deviceList);
  },
  setupController: function(controller,model){
    var _self=this;
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    controller.reopen({
      actions:{
        search(){
          _self.doQuery();
        },
      }
    });

  }
});
