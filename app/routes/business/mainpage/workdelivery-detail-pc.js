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
    header_title: '交接班信息',
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
            this.store.findRecord('workdelivery', id).then(function(data) {
                console.log("set nursing:", data);
                controller.set('data', data);
            });
        }
      }
});
