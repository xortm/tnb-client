import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  createTime: DS.attr("number"),
  startTime: DS.attr("number"),
  expectEndTime: DS.attr("number"),
  endTime: DS.attr("number"),
  customer: DS.belongsTo("customer"),
  remark: DS.attr("string"),
  reason: DS.attr("string"),
  leaveReason: DS.belongsTo('dicttype'),
  status: DS.attr("number"),
  closeStatus:DS.attr("number"),
  statusStr: Ember.computed("status","closeStatus", function() {
    var statusValue = this.get("status");
    var closeStatus=this.get("closeStatus");
    if (closeStatus==1) {
      return "已结算";
    }
    switch (statusValue) {
      case 0:
        return "已申请";
      case 1:
        return "请假中";
      case 2:
        return "已完成";
      default:
        return "";
    }
  }),
  createTimeStr: Ember.computed("createTime", function() {
    var time = this.get("createTime");
    return time ? this.get("dateService").formatDate(time, "yyyy-MM-dd") : null;
  }),
  startTimeStr: Ember.computed("startTime", function() {
    var time = this.get("startTime");
    return time ? this.get("dateService").formatDate(time, "yyyy-MM-dd") : null;
  }),
  startTimeDate:Ember.computed("startTime",function(){
    var time=this.get("startTime");
    return time?this.get("dateService").timestampToTime(time):null;
  }),
  endTimeStr: Ember.computed("endTime", function() {
    var time = this.get("endTime");
    return time ? this.get("dateService").formatDate(time, "yyyy-MM-dd") : null;
  }),
  endTimeDate:Ember.computed("endTime",function(){
    var time=this.get("endTime");
    return time?this.get("dateService").timestampToTime(time):null;
  }),
  expectEndTimeStr: Ember.computed("expectEndTime", function() {
    var time = this.get("expectEndTime");
    return time ? this.get("dateService").formatDate(time, "yyyy-MM-dd") : null;
  }),
  expectEndTimeDate:Ember.computed("expectEndTime",function(){
    var time=this.get("expectEndTime");
    return time?this.get("dateService").timestampToTime(time):null;
  }),
});
