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
    header_title: '活动总结详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('activity-hold-info', id).then(function(holdInfo) {
                controller.set('holdInfo', holdInfo);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('holdInfo', this.store.createRecord('activity-hold-info', {}));
        }
        this.store.query("activity-plan", {}).then(function(planList) {
            planList.forEach(function(plan) {
                plan.set('planPinyin', plan.get("activity.title"));
            });
            controller.set("planList", planList);
            controller.set('planListFirst', planList.get('firstObject'));
        });
    }
});
