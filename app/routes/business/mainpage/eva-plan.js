import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title: "评估模板列表",
  model() {
    return {};
  },
  buildQueryParams:function(){
    var params=this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter={type:{'typecode':'evaluateType2'}};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'title@$like':curController.get('queryCondition')});
        }
    }
    params.filter = filter;
    sort = {
        createDateTime:'desc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var evaList=this.findPaged('evaluatemodel',params,function(evaList){});
    this.getCurrentController().set("evaList", evaList);
  },
  actions:{
    search:function(){
      this.doQuery();
    },
  },
  setupController(controller, model){
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);

    this._super(controller,model);

  },
});
