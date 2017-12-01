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
    header_title: '编辑预警',
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
            // this.store.findRecord('hbeaconwarning', id).then(function(warning) {
            //     controller.set('warning', warning);
            // });
            let warning = this.store.peekRecord('hbeaconwarning',id);
            controller.set('warning',warning);
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('warning', this.store.createRecord('hbeaconwarning', {}));
        }
        this.store.query('customer', {
          filter:{
            '[customerStatus][typecode@$like]@$or1---1':'customerStatusIn',
            '[customerStatus][typecode@$like]@$or1---2':'customerStatusTry',
            'addRemark':'normal'
          }
        }).then(function(customerList) {
            customerList.forEach(function(customer) {
                customer.set('namePinyin', customer.get("name"));
            });
            controller.set('customerList', customerList);
            controller.set('customerListFirst', customerList.get('firstObject'));
        });
        this.store.query("employee", {filter:{
          staffStatus:{'typecode@$not':Constants.staffStatusLeave}
        }}).then(function(staffList) {
            console.log("staffList is", staffList);
            staffList.forEach(function(staff) {
                staff.set('operaterPinyin', staff.get("name"));
            });
            controller.set("staffList", staffList);
            controller.set('staffListFirst', staffList.get('firstObject'));
        });
    }
});
