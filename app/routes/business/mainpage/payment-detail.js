import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  header_title:'扣费信息',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      this.store.findRecord('tradedetail',id).then(function(tradeInfo){
        controller.set('tradeInfo',tradeInfo);
      });
    }else{
      controller.set('detailEdit',true);
      controller.set('tradeInfo',this.store.createRecord('tradedetail',{}));
    }
    let filterCustomer;
    filterCustomer = $.extend({}, filterCustomer, {
        '[customerStatus][typecode@$like]@$or1---1': 'customerStatusIn'
    });
    filterCustomer = $.extend({}, filterCustomer, {
        '[customerStatus][typecode@$like]@$or1---2': 'customerStatusTry'
    });
    filterCustomer = $.extend({}, filterCustomer, {
        'addRemark@$not': 'directCreate'
    });
    this.store.query('customer',{filterCustomer}).then(function(customerList){
      customerList.forEach(function(customer){
        customer.set('namePinyin',pinyinUtil.getFirstLetter(customer.get("name")));
      });
      controller.set('customerList',customerList);
    });

  }
});
