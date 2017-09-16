import DS from 'ember-data';
import BaseModel from './base-model';

var staffschedule = BaseModel.extend({
  createDateTime:DS.attr('number'),//添加时间
  createUser:DS.belongsTo('user'),//排班人员
  remark:DS.attr('string'),//备注
  dateService: Ember.inject.service("date-service"),
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  employee:DS.belongsTo('employee'),//护理人员
  workTimeSetting:DS.belongsTo('worktimesetting'),//班次
  setting:DS.belongsTo('staffworktimesetting'),
  year:DS.attr('string'),
  month:DS.attr('string'),
  day:DS.attr('string'),
  week:DS.attr('string'),
  weekIndex:DS.attr('string'),

  mouthHasDays:Ember.computed("year","month","day",function(){
    var year = this.get("year");
    var mouth = this.get("month");
    var day = this.get("day");
    var YMDtime = year+"/"+mouth+"/"+day;
    var curDate = new Date(YMDtime);
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
   curDate.setMonth(curMonth + 1);
   /* 因为获取的是当前时间的日期，不set成0 就只是获取该天数，set 0，就会变成上一月的最后一天 */
   curDate.setDate(0);
   /* 返回当月的天数 */
   return curDate.getDate();
  }),

});
export default staffschedule;
