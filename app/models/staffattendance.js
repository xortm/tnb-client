
import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  lastUpdateUser:DS.belongsTo('user'),//更新操作者user
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  createUser:DS.belongsTo('user'),//创建者
  remark: DS.attr('string'),//备注
  employee:DS.belongsTo('employee'),//护工
  workTimeSetting:DS.belongsTo('worktimesetting'),//排班
  startTime:DS.attr('string'),//开始班次时间
  endTime:DS.attr('string'),//结束班次时间
  attendanceTime:DS.attr('number'),//考勤时间
  startWorkTime:DS.attr('number'),//开始签到时间
  endWorkTime:DS.attr('number'),//结束签到时间
  startWorkPoint:DS.belongsTo('room'),//开始签到地点
  endWorkPoint:DS.belongsTo('room'),//结束签到地点

  attendanceTimeStr:Ember.computed("attendanceTime", function() {
      var attendanceTime = this.get("attendanceTime");
      return attendanceTime?this.get("dateService").formatDate(attendanceTime, "yyyy-MM-dd"):'无';
  }),
  startWorkTimeStr:Ember.computed("startWorkTime", function() {
      var startWorkTime = this.get("startWorkTime");
      return startWorkTime?this.get("dateService").formatDate(startWorkTime, "hh:mm"):'无';
  }),
  endWorkTimeStr:Ember.computed("endWorkTime", function() {
      var endWorkTime = this.get("endWorkTime");
      return endWorkTime?this.get("dateService").formatDate(endWorkTime, "hh:mm"):'无';
  }),

});
