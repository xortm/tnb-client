import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  details:DS.hasMany('nursingplandetail'),
  remark:DS.attr('string'),
  yearTab:DS.attr('number'),//年
  weekIndex:DS.attr('number'),//周序号
  customers:DS.attr('string'),
  weekTab:DS.attr('number'),//周几
  itemType:DS.attr('string'),//项目类型，日项目：day，周项目：week
});
