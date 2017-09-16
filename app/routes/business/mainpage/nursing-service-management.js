import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'服务项目',

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
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
        }
        if(curController.get('serviceTypeID')){
          filter = $.extend({}, filter, {'[serviceType][id]':curController.get('serviceTypeID')});
        }
    }
    params.filter = filter;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var serviceList=this.findPaged('customerserviceitem',params,function(serviceList){});
    this.getCurrentController().set("serviceList", serviceList);
    this.getCurrentController().set("serviceTypeID",'');
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    controller.set("countTypeID", null);
    controller.set("serviceTypeID", null);
    controller.set("queryCondition", null);
    this.doQuery();
    this._super(controller,model);


  }
});
