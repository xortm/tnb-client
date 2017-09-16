import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'药品字典',

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
    }

    params.filter = filter;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var drugList=this.findPaged('drug',params,function(drugList){
    });
    this.getCurrentController().set("drugList", drugList);
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController: function(controller,model){
    this.doQuery();
    this._super(controller,model);
  }
});
