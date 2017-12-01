import DS from 'ember-data';
import BaseModel from './base-model';

var workdelivery = BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    createDateTime: DS.attr('number'), //创建时间
    createUser: DS.belongsTo('user'), //创建人
    lastUpdateDateTime: DS.attr('number'), //更新时间
    lastUpdateUser: DS.belongsTo('user'), //更新人
    remark: DS.attr('string'), //交接详情
    sender: DS.belongsTo('employee'), //发起人
    receiver: DS.belongsTo('employee'), //接收人
    receiveTime: DS.attr('number'),
    status: DS.belongsTo('dicttype'),
    illChange: DS.attr('string'),//病情变化
    specialRemark: DS.attr('string'),//特殊交代
    inBedNum: DS.attr('string'),//入住人数
    outOldPerson: DS.attr('string'),//退住请假老人
    newInOldPerson: DS.attr('string'),//新入住老人
    createDateString: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd hh:mm");
    }),
    createDateStringBefore: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd");
    }),
    createDateStringAfter: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").formatDate(createDateTime, "hh:mm");
    }),
    receiveDateString: Ember.computed("receiveTime", function() {
        var receiveTime = this.get("receiveTime");
        if (receiveTime) {
            return this.get("dateService").formatDate(receiveTime, "yyyy-MM-dd hh:mm");
        } else {
            return;
        }

    }),
    remarkString: Ember.computed("remark", function() {
        var remark = this.get("remark");
        if (remark) {
            if (remark.length > 10) {
                return remark.substring(0, 9) + "...";
            } else {
                return remark;
            }
        } else {
            return null;
        }
    }),
    illChangeString: Ember.computed("illChange", function() {
        var remark = this.get("illChange");
        if (remark) {
            if (remark.length > 10) {
                return remark.substring(0, 9) + "...";
            } else {
                return remark;
            }
        } else {
            return null;
        }
    }),
    specialRemarkString: Ember.computed("specialRemark", function() {
        var remark = this.get("specialRemark");
        if (remark) {
            if (remark.length > 10) {
                return remark.substring(0, 9) + "...";
            } else {
                return remark;
            }
        } else {
            return null;
        }
    }),
});

export default workdelivery;
