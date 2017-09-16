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
    header_title: '饮食方案详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('scheme', id).then(function(diet) {
                controller.set('diet', diet);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('diet', this.store.createRecord('scheme', {}));
        }

    }
});
