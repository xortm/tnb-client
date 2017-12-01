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
  header_title:'执行情况信息',
  dataLoader:Ember.inject.service('data-loader'),
  model(){
    return{};
  },
  setupController(controller, model){
    this._super(controller, model);
    let finishLevelList = this.get('dataLoader.serviceFinishDefaultList');
    var editMode=this.getCurrentController().get('editMode');
    var id=this.getCurrentController().get('id');
    if(editMode=='edit'){
      controller.set('detailEdit',false);
      let planInfo = this.store.peekRecord('nursingplanexe',id);
      let str = '';
      if(planInfo.get('exeTabRemark')){
        let remark = JSON.parse(planInfo.get('exeTabRemark'));
        let list = remark.remarkStr.split(',');

        for(let i=0;i<list.length;i++){
          if(finishLevelList.findBy('remark',list[i])){
            let item = finishLevelList.findBy('remark',list[i]);
            str += item.get('name') + ',';
          }
        }
        str = str.substring(0,str.length-1);
      }else{
        str = '无';
      }

      planInfo.set('exeTabRemarkStr',str);
      controller.set('planInfo',planInfo);
      controller.set('planInfo.exeTabRemarkStr',str);
    }else{
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
      controller.set('detailEdit',true);
      controller.set('planInfo',this.store.createRecord('nursingplanexe',{}));
      this.store.query('customer',{filterCustomer}).then(function(customerList){
        controller.set('customerList',customerList);
      });
    }
    //获取护理计划列表
    // this.store.query('nursingplandetail',{}).then(function(nursingplanList){
    //   controller.set('nursingplanList',nursingplanList);
    // });
    //获取护工老人对照表
    this.store.query('employee',{filter:{staffStatus:{typecode:'staffStatusIn'}}}).then(function(staffcustomerList){
      controller.set('staffcustomerList',staffcustomerList);
    });

  }
});
