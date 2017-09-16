import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination,{
  header_title:'账单列表',
  billTypeID:'',
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
          filter = $.extend({}, filter, {'[customer][name@$like]':curController.get('queryCondition')});
        }
        if(curController.get('searchStatus')){
          filter = $.extend({}, filter, {'[billStatus][typecode]':curController.get('searchStatus')});
        }
    }
    params.filter = filter;
    sort = {
        'billTime':'desc',
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    var params=this.buildQueryParams();
    var billList=this.findPaged('customerbill',params,function(billList){});
    this.getCurrentController().set("billList", billList);
  },
  actions:{
    search(){
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
