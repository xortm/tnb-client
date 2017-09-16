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
    header_title: '活动计划详情',
    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        var editMode = this.getCurrentController().get('editMode');
        var id = this.getCurrentController().get('id');
        if (editMode == 'edit') {
            controller.set('detailEdit', false);
            this.store.findRecord('activity-plan', id).then(function(activityPlan) {
                controller.set('activityPlan', activityPlan);
            });
        } else {
            controller.set('detailEdit', true);
            controller.set('activityPlan', this.store.createRecord('activity-plan', {}));
        }
        this.store.query('activity',{}).then(function(activityList){
          console.log('activity-plan:activityList',activityList.get('length')+";"+activityList);
          activityList.forEach(function(activityObj){
            activityObj.set('namePinyin', activityObj.get("title"));
          });
          controller.set('activityList', activityList);
        });
    }
});
