import DS from 'ember-data';
import BaseModel from './base-model';
/*客户*/
export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    tenant: DS.belongsTo('tenant'), //对应租户
    activityPlan: DS.belongsTo('activity-plan'), //活动安排
    employee: DS.belongsTo('employee'), //服务人员
    customer: DS.belongsTo('customer'), //预约用户
    activityTime: DS.attr('number'),//活动时间
    activityTimeDate: Ember.computed("activityTime", function() {
        var activityTime = this.get("activityTime");
        return this.get("dateService").timestampToTime(activityTime);
    }),
    activityTimeString: Ember.computed("activityTime", function() {
        var activityTime = this.get("activityTime");
        return this.get("dateService").formatDate(activityTime, "yyyy-MM-dd");
    }),
});
