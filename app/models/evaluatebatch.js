import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*评估问卷主表*/
var evaluateBatch = BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    dateService: Ember.inject.service("date-service"),
    createUser:DS.belongsTo('user'),//创建人
    lastUpdateUser:DS.belongsTo('user'),//更新操作者user id
    createDateTime: DS.attr('number'),//创建时间
    lastUpdateDateTime: DS.attr('number'),//更改时间
    user:DS.belongsTo('employee'),//评估人
    customer:DS.belongsTo('customer'),//评估老人
    batch: DS.attr('number'),//批次
    remark: DS.attr('string'), //备注
    createDate: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").timestampToTime(createDateTime);
    }),
    createDateTimeString: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd");
    }),
});
export default evaluateBatch;
