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
    header_title: '健康数据详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            var health=this.store.peekRecord('health-info', id);
            controller.set('health', health);
            var healthDict = health.get("itemtype");
            console.log("healthDict:",healthDict);
            controller.healthSelect(healthDict);
        } else {
            controller.set('detailEdit', true);
            controller.set('health', this.store.createRecord('health-info', {}));
            controller.set('bloodShow', false);
            controller.set('heartShow', false);
            controller.set('analysisShow', false);
            controller.set('OxygenShow', false);
            controller.set('bloodFatShow', false);
        }
        //查询所有的老人
        this.store.query('customer',{}).then(function(customerList){
          customerList.forEach(function(customer){
            customer.set('namePinyin',customer.get('name'));
          });
          controller.set('customerList',customerList);
          controller.set('customerListFirst', customerList.get('firstObject'));
        });
    }
});
