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
    header_title: '执行报告详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('execution-report', id).then(function(report) {
                controller.set('report', report);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('report', this.store.createRecord('execution-report', {}));
        }
       //查询所有老人
       this.store.query('customer',{}).then(function(customerList){
         customerList.forEach(function(obj){
           obj.set('namePinyin',obj.get('name'));
         });
         controller.set('customerList',customerList);
       });
    }
});
