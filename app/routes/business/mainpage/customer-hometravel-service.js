import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';
const {bizTypeWithdra_wash} = Constants;

// import RouteMixin from 'ember-cli-3pagination/remote/route-mixin';

export default BaseBusiness.extend(Pagination,{
  header_title:'客户列表',
  model(){
    return ;
  },
  perPage: 12,
  buildQueryParams(){
    var _self = this;
    var params = this.pagiParamsSet();
    var curController = this.getCurrentController();
    var filter = {};
    if (curController) {
        if (curController.get('queryCondition')) {
          filter = $.extend({}, filter, {'[bed][name@$like]@$or1':curController.get('queryCondition')});
          filter = $.extend({}, filter, {'name@$like@$or1':curController.get('queryCondition')});
          //filter = $.extend({}, filter, {'[bed][name@$like]@$or1':curController.get('queryCondition')});

       }
    }

    params.filter = filter;
    console.log("params is:", params);
    return params;
  },
  doQuery: function(){
    var _self = this;
    console.log('defaultCallaaaaaa');
    var params = this.buildQueryParams();//拼查询条件
    var customerList = this.findPaged('customer',params);
    this.getCurrentController().set("cusList",customerList);
  },
  // setStatus:function(list){
  //   list.forEach(function(item){
  //     console.log('item.get',item.get('businessType').get('typecode'));
  //     if(item.get('businessType').get('typecode') == bizTypeWithdra_wash){
  //       console.log('ininininininininin');
  //       item.set('amountSymbol','-'+item.get('amount'));
  //     }
  //     else{
  //       item.set('amountSymbol','+'+item.get('amount'));
  //     }
  //   });
  // },
  actions:  {
    search:function(){
      //alert("111111");
      this.doQuery();
      //alert("22222");
    }
  },
  setupController(controller,model){
    this.doQuery();
    var queryCondition = controller.get('input');
    controller.set('queryCondition', queryCondition);
    this._super(controller,model);
    //controller.set("params",{});
    controller.customerListObs();
}
});
