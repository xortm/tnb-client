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
    var filter={billStatus:{typecode:'billStatus1'}};
    var sort;
    if (curController) {
        if (curController.get('queryCondition')) {

          filter = $.extend({}, filter, {'[customer][name@$like]@$or1':curController.get('queryCondition')});

        }
    }
    params.filter = filter;
    sort = {
        // '[room][floor][building][createDateTime]': 'asc',
        // '[room][floor][seq]': 'asc',
        // '[room][name]': 'asc',
        'billTime':'desc'
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
