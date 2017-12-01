import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  dataLoader: Ember.inject.service("data-loader"),
    queryParams: {
        id: {
            refreshModel: true
        },
        editMode: {
            refreshModel: true
        },
    },
    detailEdit: true,
    header_title: '变更信息',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        let _self = this;
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            controller.set("flagEdit", true);
            this.store.findRecord('customerserverchange', id).then(function(change) {
                controller.set('change', change);
                if(change.get('customer.chargeType.typecode')=='chargeTypeY'){
                  controller.set('chargeTypeFlag',true);
                }else{
                  controller.set('chargeTypeFlag',false);
                }
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('change', this.store.createRecord('customerserverchange', {newFlowFlag:false}));
        }
        this.store.query('customer', {filter:{
          "applyFlag":0,
          '[customerStatus][typecode@$like]@$or1---1':'customerStatusIn',
          '[customerStatus][typecode@$like]@$or1---2':'customerStatusTry',
          'addRemark':'normal'
        }}).then(function(customerList) {
            customerList.forEach(function(customer) {
                customer.set('namePinyin', customer.get("name"));
            });
            controller.set('customerList', customerList);
            controller.set('customerListFirst', customerList.get('firstObject'));
        });
        //查询楼宇
        this.store.query('floor',{}).then(function(floorList){
          floorList.forEach(function(floor){
            floor.set('namePinyin',pinyinUtil.getFirstLetter(floor.get("name")));
          });
          controller.set('floorList',floorList);
        });
        this.store.query('bed', {filter:{
          '[status][typecode]': 'bedStatusIdle'
        }
        }).then(function(bedList) {
          bedList.forEach(function(bed) {
              bed.set('bedPinyin', pinyinUtil.getFirstLetter(bed.get("name")));
          });
            controller.set('bedList', bedList);
            controller.set('bedListFirst', bedList.get('firstObject'));
            console.log("bedList is",bedList);
        });
        controller.set('levelList',_self.get('dataLoader.serviceLevel'));
    }
});
