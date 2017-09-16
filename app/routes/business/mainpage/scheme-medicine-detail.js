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
    header_title: '中医方案详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('scheme', id).then(function(medicine) {
                controller.set('medicine', medicine);
                console.log('medicine', medicine);
                console.log('medicine img:', medicine.get("picPathUrl"));
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('medicine', this.store.createRecord('scheme', {}));
        }

    }
});
