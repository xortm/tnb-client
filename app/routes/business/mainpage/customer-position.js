import Ember from 'ember';
import BaseBusiness from '../base-business';
import Pagination from '../pagination';

export default BaseBusiness.extend(Pagination, {
  header_title: '老人位置',
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
         'name':'asc'
    };
    params.sort = sort;
    return params;
  },
  doQuery:function(){
    let _self = this;
    var params=this.buildQueryParams();
    var buildingList=this.findPaged('building',params).then(function(buildingList){
      _self.getCurrentController().set("buildingList", buildingList);
      if(buildingList&&buildingList.get("length")>0){
        _self.getCurrentController().send('selectBuild',buildingList.get('firstObject'));
      }
    });
  },

  setupController:function(controller,model){
    this._super(controller,model);
    controller.set("customerSeach",true);
    this.store.query('customer',{filter:{
      'customerStatus---1':{'typecode@$or1---1':'customerStatusIn'},
      'customerStatus---2':{'typecode@$or1---2':'customerStatusTry'}
    }}).then(function(customers){
      var customerList = new Ember.A();
      customers.forEach(function(item){//去掉居家老人 没有床位的老人
        if(item.get("bed.id")){
          customerList.pushObject(item);
          
        }
      });
      controller.set("theCustomerList",customerList);
    });
    this.doQuery();
  },

  actions:{},
});
