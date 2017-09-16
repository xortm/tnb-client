import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{

  model() {
    return {};
  },

  buildQueryParams:function(){
    let params=this.pagiParamsSet();
    let curController = this.getCurrentController();
    let filter={};
    let sort={};
    let _self = this;
    if (curController) {
        if (curController.get('searchInput')) {
          filter["title@$or1$like"]=curController.get('searchInput');
          filter.customer={};
          filter["customer"]["name@$or1$like"]=curController.get('searchInput');
        }
      }
      params.filter = filter;
      sort = {
          '[createTime]': 'desc',
      };
      params.sort = sort;
      return params;
  },

  doQuery:function(){
    let params=this.buildQueryParams();
    let reportList=this.findPaged('physical-report',params,function(reportList){});
    this.getCurrentController().set("reportList", reportList);
  },

  setupController:function(controller,model){
    controller.set('searchInput',null);
    this.doQuery();
    let searchInput = controller.get('input');
    controller.set('searchInput', searchInput);
    this._super(controller,model);
  }
});
