import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'租户管理2232',

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
          filter = $.extend({}, filter, {'orgName@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var tenantList=this.findPaged('tenant',params,function(tenantList){
      console.log(tenantList);
      console.log('*-*-*-*-*-*-*-*-*-*-');
    });

    this.getCurrentController().set("tenantList", tenantList);
    this.getCurrentController().set("careTypeID",'');
  },
  actions:{
    search:function(){
      this.doQuery();
    },
    careTypeSelect(careType){
      if(careType){
        this.set('careTypeID',careType.id);
      }else{
        this.set('careTypeID','');
      }
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);


  }
});
