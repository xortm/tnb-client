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
    header_title: '运动方案详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('scheme', id).then(function(sports) {
                controller.set('sports', sports);
                console.log('sports', sports);
                console.log('sports img:', sports.get("picPathUrl"));
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('sports', this.store.createRecord('scheme', {}));
        }

    }
});
