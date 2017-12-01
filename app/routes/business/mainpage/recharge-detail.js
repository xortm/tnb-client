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
    detailEdit: true,
    header_title: '充值信息',
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
            this.store.findRecord('rechargerecord', id).then(function(recharge) {
                console.log("set recharge:", recharge);
                controller.set('recharge', recharge);
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('recharge', this.store.createRecord('rechargerecord', {}));
        }
        this.store.query('customer',{filter:{
               'addRemark':'normal',customerStatus:{'typecode@$not':'customerStatusOut'}
        }}).then(function(customerList){
          customerList.forEach(function(customer){
               //customer.set('accountPinyin',pinyinUtil.getFirstLetter(customer.get("name")));
               customer.set('accountPinyin',customer.get("name"));
             });
             controller.set('customerList', customerList);
             controller.set('accountListFirst', customerList.get('firstObject'));
        });
    }
});
