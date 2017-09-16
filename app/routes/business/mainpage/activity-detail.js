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
    header_title: '活动信息详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('activity', id).then(function(activity) {
                controller.set('activity', activity);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('activity', this.store.createRecord('activity', {}));
        }
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
