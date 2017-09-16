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
    header_title: '活动预约详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('activity-order', id).then(function(activityOrder) {
                controller.set('activityOrder', activityOrder);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('activityOrder', this.store.createRecord('activity-order', {}));
        }
        //查询所有老人
        this.store.query('customer',{}).then(function(customerList){
          customerList.forEach(function(obj){
            obj.set('customerPinyin',obj.get('name'));
          });
          controller.set('customerList',customerList);
          console.log('customerList:',customerList);
        });
        this.store.query('activity',{}).then(function(activityList){
          console.log('activity-plan:activityList',activityList.get('length')+";"+activityList);
          activityList.forEach(function(activityObj){
            activityObj.set('activityPinyin', activityObj.get("title"));
          });
          controller.set('activityList', activityList);
        });
        this.store.query("employee", {}).then(function(employeeList) {
            employeeList.forEach(function(employee) {
                employee.set('employeePinyin', employee.get("name"));
            });
            controller.set("employeeList", employeeList);
            controller.set('employeeListFirst', employeeList.get('firstObject'));
        });
    }
});
