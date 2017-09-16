import Ember from 'ember';
import BaseBusiness from '../base-business';
const {customerStatusIn,customerStatusTry} = Constants;
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
    header_title: '编辑日志',
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
            this.store.findRecord('nursinglog', id).then(function(nursing) {
                console.log("set nursing:", nursing);
                controller.set('nursing', nursing);
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            var curUser = this.get("global_curStatus").getUser();
            controller.set('nursing', this.store.createRecord('nursinglog', {
                createUser: curUser
            }));
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
        this.store.query('customer', {filterCustomer}).then(function(customerList) {
          console.log("customer 老人是：",customerList);
            customerList.forEach(function(customer) {
                  customer.set('namePinyin', pinyinUtil.getFirstLetter(customer.get("name")));
            });

            console.log("customerList对应的值是：",customerList);
            controller.set('customerList',customerList);
            controller.set('customerListFirst', customerList.get('firstObject'));
            //console.log("++++++++++++++customerList+++++++++++++++++",customerList);
        });

        this.store.query("employee", {filter:{
          staffStatus:{'typecode@$not':Constants.staffStatusLeave}
        }}).then(function(employeeList) {
            console.log("employeeList is", employeeList);
            employeeList.forEach(function(employee) {
                employee.set('recordPinyin', pinyinUtil.getFirstLetter(employee.get("name")));
            });
            controller.set("employeeList", employeeList);
            controller.set('employeeListFirst', employeeList.get('firstObject'));
        });
    }
});
