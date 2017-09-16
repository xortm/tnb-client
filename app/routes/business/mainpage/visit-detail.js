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
        consultId: {
            refreshModel: true
        },
    },
    detailEdit: true,
    header_title: '回访信息',
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
            this.store.findRecord('backvist', id).then(function(vist) {
                console.log("set vist:", vist);
                controller.set('vist', vist);
            });
        } else {
            controller.set("flagEdit", false);
            controller.set('detailEdit', true);
            controller.set('vist', this.store.createRecord('backvist', {}));
            console.log("route vist",controller.get('vist'));
        }
        this.store.query("user", {}).then(function(staffList) {
          console.log("staffList is",staffList);
          staffList.forEach(function(staff){
            staff.set('vistUserPinyin',pinyinUtil.getFirstLetter(staff.get("name")));
          });
            controller.set("staffList", staffList);
            controller.set('staffListFirst', staffList.get('firstObject'));
        });
    }
});
