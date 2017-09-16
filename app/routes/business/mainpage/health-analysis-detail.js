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
    header_title: '编辑健康建议',
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
            this.store.findRecord('health-analysis', id).then(function(analysis) {
                controller.set('analysis', analysis);
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('analysis', this.store.createRecord('health-analysis', {}));
        }
        this.store.query('customer', {
          filter:{}
        }).then(function(customerList) {
            customerList.forEach(function(customer) {
                customer.set('namePinyin', customer.get("name"));
            });
            controller.set('customerList', customerList);
            controller.set('customerListFirst', customerList.get('firstObject'));
        });
        // this.store.query("employee", {}).then(function(staffList) {
        //     console.log("staffList is", staffList);
        //     staffList.forEach(function(staff) {
        //         staff.set('operaterPinyin', staff.get("name"));
        //     });
        //     controller.set("staffList", staffList);
        //     controller.set('staffListFirst', staffList.get('firstObject'));
        // });
    }
});
