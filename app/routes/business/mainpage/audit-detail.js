import Ember from 'ember';
import BaseBusiness from '../base-business';
const {createType1,createType2,billStatus0,billStatus3} = Constants;
export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      flag: {
          refreshModel: true
      },
  },
  constants:Constants,
  header_title:'审核账单',
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let constants = this.get('constants');
    let _self = this;
    let id=this.getCurrentController().get('id');
    let flag = this.getCurrentController().get('flag');
    if(flag == 'billType'){
      this.store.findRecord('customerbill',id).then(function(billInfo){
        controller.set('billInfo',billInfo);
        controller.set('chargeType',false);
          let customer = billInfo.get('customer.id');
          let filter = {};
          if(billInfo.get('billType.typecode')==constants.billType4){
            filter = {customer:{id:customer},billYear:billInfo.get('billYear')};
          }
          if(billInfo.get('billType.typecode')==constants.billType3){
            filter = {customer:{id:customer},billYear:billInfo.get('billYear'),billQuarter:billInfo.get('billQuarter')};
          }
          if(billInfo.get('billType.typecode')==constants.billType2){
            filter = {customer:{id:customer},billYear:billInfo.get('billYear'),billMonth:billInfo.get('billMonth')};
          }
          if(billInfo.get('billType.typecode')=='chargeTypeD'){
            filter = $.extend({}, filter, {'bill':{id:id}});
            controller.set('chargeType',true);
          }
          let params = {};
          params.filter = filter;
          if(billInfo.get('billStatType.typecode')=='billStatTypeJC'){
            _self.store.query('customerdaybill',params).then(function(dayBillList){
              controller.set('dayBillList',dayBillList);
              controller.set('appreciationBillList',null);
            });
          }
          if(billInfo.get('billStatType.typecode')=="billStatTypeZZ"){
            _self.store.query('customerservicebill',params).then(function(dayBillList){
              controller.set('appreciationBillList',dayBillList);
              controller.set('dayBillList',null);
            });
          }
          controller.set('rechargeType',false);
          controller.set('billType',true);
      });
    }
    if(flag == 'rechargeType'){
      let rechargeInfo = this.store.peekRecord('rechargerecord',id);
      controller.set('rechargeType',true);
      controller.set('billType',false);
      controller.set('billInfo',rechargeInfo);
    }
  }
});
