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
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            controller.set("flagEdit", true);
            this.store.findRecord('customerserverchange', id).then(function(change) {
                console.log("set change:", change);
                controller.set('change', change);
                console.log("controller.set('change', change)",controller.get('change.foodLevelOld.typename'));

                // if(change.status.typecode=='applyStatus1'){
                //   alert('applyStatus1');
                //   controller.set('isOkEdit', true);
                // }
                // if(change.status.typecode=='applyStatus2'){
                //   alert('applyStatus2');
                //   controller.set('isOkEdit', false);
                // }
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('change', this.store.createRecord('customerserverchange', {}));
        }
        this.store.query('customer', {filter:{
          "applyFlag":0,
          '[customerStatus][typecode@$like]@$or1---1':'customerStatusIn',
          '[customerStatus][typecode@$like]@$or1---2':'customerStatusTry',
          'addRemark':'normal'
        }}).then(function(customerList) {
            customerList.forEach(function(customer) {
                //customer.set('namePinyin', pinyinUtil.getFirstLetter(customer.get("name")));
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
        // this.store.query("user", {}).then(function(staffList) {
        //     console.log("staffList is", staffList);
        //     staffList.forEach(function(staff) {
        //         staff.set('operaterPinyin', pinyinUtil.getFirstLetter(staff.get("name")));
        //     });
        //     controller.set("staffList", staffList);
        //     controller.set('staffListFirst', staffList.get('firstObject'));
        // });
    }
});
