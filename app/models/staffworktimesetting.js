import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  schedules:DS.hasMany('staffschedule'),
  target:DS.attr('string'),  //复制到周序号
  resource:DS.attr('string'),//被复制周序号
  staffs:DS.attr('string'),//保存的护工ID
});
