import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'居家项目列表',

  model:function(){
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={serviceSource:{typecode:'jujia'}};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'name@$like':curController.get('queryCondition')});
        }
    }
    if(this.get('serviceTypeID')){
      filter = $.extend({}, filter, {'[serviceType][id]':this.get('serviceTypeID')});
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
    serviceTypeSelect(serviceType){
      if(serviceType){
        this.set('serviceTypeID',serviceType.get('id'));
      }else{
        this.set('serviceTypeID','');
      }

      this.doQuery();
    },
  },
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);
  }
});
