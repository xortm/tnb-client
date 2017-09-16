import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'医护物品列表',
  model() {
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
    }
    params.filter = filter;
    sort = {
         'name':'asc',
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var merchList=this.findPaged('nursemerch',params,function(merchList){
    });
    this.getCurrentController().set("merchList", merchList);
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },

  setupController: function(controller,model){
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
  }
});
