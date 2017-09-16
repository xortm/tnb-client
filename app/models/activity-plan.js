import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    tenant: DS.belongsTo('tenant'), //对应租户
    time: DS.attr('string'), //活动时间
    day: DS.belongsTo('dicttype'), //周几
    place: DS.attr('string'), //举办地点
    activity: DS.belongsTo('activity'), //活动
    picPath:DS.attr('string'),//图片路径
    description:DS.attr('string'),//活动描述description

    //根据规则拼出完整的url
    picPathUrl: Ember.computed('picPath', function() {
        var picPath = this.get("picPath");
        if (!picPath) {
            picPath = "anonymous.png";
            return this.get("pathConfiger").getAvatarLocalPath(picPath);
        }
        console.log("this.pathConfiger", this.get("pathConfiger"));
        return this.get("pathConfiger").getJujiaRemotePath(picPath);
    }),
});
