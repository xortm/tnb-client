import DS from 'ember-data';
import BaseModel from './base-model';
/*客户*/
export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
    createTime: DS.attr('number'), //创建时间
    title: DS.attr('string'), //标题
    contents: DS.attr('string'), //内容
    customer: DS.belongsTo('customer'), //反馈人
    user: DS.belongsTo('user'), //反馈人
    type: DS.belongsTo('dicttype'), //类型 对应groupcode为feedbackType
    telephone: DS.attr('string'), //预留手机号
    createTimeDate: Ember.computed("createTime", function() {
        var createTime = this.get("createTime");
        return this.get("dateService").timestampToTime(createTime);
    }),
    createTimeString: Ember.computed("createTime", function() {
        var createTime = this.get("createTime");
        return this.get("dateService").formatDate(createTime, "yyyy-MM-dd hh:mm:ss");

    }),
});
