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
    header_title: '通知详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            let message = this.store.peekRecord('message',id);
            controller.set('message',message);

            // this.store.findRecord('message', id).then(function(message) {
            //     controller.set('message', message);
            // });
        } else {
            controller.set('detailEdit', true);
            controller.set('message', this.store.createRecord('message', {}));
        }
       //查询所有老人
       this.store.query('customer',{}).then(function(customerList){
         customerList.forEach(function(obj){
           obj.set('namePinyin',obj.get('name'));
         });
         controller.set('customerList',customerList);
         console.log('customerList::',customerList);
       });
    }
});
