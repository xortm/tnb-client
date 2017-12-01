import Ember from 'ember';
import BaseBusiness from '../base-business';
const {createType1,createType2,billStatus0,billStatus3} = Constants;
export default BaseBusiness.extend({
  queryParams: {
      id: {
          refreshModel: true
      },
      editMode: {
          refreshModel: true
      },
  },
  constants:Constants,
  header_title:'账单信息',
  model(){
    return{};
  },
  setupController(controller, model){
    let _self = this;
    this._super(controller, model);
    let editMode=this.getCurrentController().get('editMode');
    let id=this.getCurrentController().get('id');
    let constants = this.get('constants');
    //进入详情页面
    if(editMode=='detail'){
      controller.set('detailEdit',false);
      controller.set('readOnly',false);
      controller.set('addModel',false);
      _self.store.findRecord('customerbill',id).then(function(billInfo){
        controller.set('billInfo',billInfo);
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
          let params = {};
          params.filter = filter;

          if(billInfo.get('billStatType.typecode')=='billStatTypeJC'){
            _self.store.query('customerdaybill',params).then(function(dayBillList){
              controller.set('dayBillList',dayBillList);
              controller.set('appreciationBillList',null);
              controller.set('appreciationBill',false);
            });
          }
          if(billInfo.get('billStatType.typecode')=="billStatTypeZZ"){
            _self.store.query('customerservicebill',params).then(function(dayBillList){
              controller.set('appreciationBillList',dayBillList);
              controller.set('appreciationBill',true);
              controller.set('dayBillList',null);
            });
          }
          controller.set('createModel',true);
          controller.set('autoModel',false);
          _self.store.query('nursingproject',{filter:{customer:{id:billInfo.get('customer.id')}}},{sort:{createDateTime:'asc'}}).then(function(projectList){
            let proPrice = parseInt(projectList.get('lastObject').get('price'));
            let bedPrice = parseInt(billInfo.get('customer.bed.price'));
            let diningPrice = parseInt(billInfo.get('customer.diningStandard.remark'));
            controller.set('proPrice',proPrice);
            controller.set('bedPrice',bedPrice);
            controller.set('diningPrice',diningPrice);
            controller.set('experiencePrice',bedPrice+diningPrice+proPrice);
          });

        if(billInfo.get('billCreateType.typecode')==createType2){
          if(billInfo.get('billStatus.typecode')==billStatus0){
            controller.set('autoModel',true);
            controller.set('createModel',false);
            controller.set('unsubmitted',true);
          }
          if(billInfo.get('billStatus.typecode')==billStatus3){
            controller.set('autoModel',true);
            controller.set('createModel',false);
            controller.set('unsubmitted',false);
          }
        }
      });
    }
    //进入编辑页面
    if(editMode=='edit'){
      controller.set('detailEdit',true);
      controller.set('readOnly',false);
      controller.set('addModel',false);
      _self.store.findRecord('customerbill',id).then(function(billInfo){
        controller.set('billInfo',billInfo);
        if(billInfo.get('billCreateType.typecode')!==createType2){
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
          let params = {};
          params.filter = filter;
          console.log('billInfo.billStatType',billInfo.get('billStatType.typecode'));
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
          controller.set('createModel',true);
          controller.set('autoModel',false);
          _self.store.query('nursingproject',{filter:{customer:{id:billInfo.get('customer.id')}}},{sort:{createDateTime:'asc'}}).then(function(projectList){
            let proPrice = parseInt(projectList.get('lastObject').get('price'));
            let bedPrice = parseInt(billInfo.get('customer.bed.price'));
            let diningPrice = parseInt(billInfo.get('customer.diningStandard.remark'));
            controller.set('proPrice',proPrice);
            controller.set('bedPrice',bedPrice);
            controller.set('diningPrice',diningPrice);
            controller.set('experiencePrice',bedPrice+diningPrice+proPrice);
          });
        }
        if(billInfo.get('billCreateType.typecode')==createType2){
          if(billInfo.get('billStatus.typecode')==billStatus0){
            controller.set('unsubmitted',true);
            controller.set('autoModel',true);
            controller.set('detailEdit',true);
            controller.set('createModel',false);
          }
          if(billInfo.get('billStatus.typecode')==billStatus3){
            controller.set('unsubmitted',false);
            controller.set('autoModel',true);
            controller.set('detailEdit',true);
            controller.set('createModel',false);
          }
        }
      });
    }
    //进入新增页面
    if(editMode=='add'){
      controller.set('readOnly',false);
      controller.set('addModel',true);
      controller.set('createModel',false);
      controller.set('autoModel',false);
      controller.set('detailEdit',true);
      controller.set('billInfo',this.store.createRecord('customerbill',{}));
    }
    if(editMode=='readOnly'){
      controller.set('addModel',false);
      controller.set('createModel',false);
      controller.set('autoModel',false);
      controller.set('detailEdit',false);
      controller.set('readOnly',true);
      _self.store.findRecord('customerbill',id).then(function(billInfo){
        controller.set('billInfo',billInfo);
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
          let params = {};
          params.filter = filter;

          console.log(billInfo.get('billStatType.typecode'));
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
      });
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
