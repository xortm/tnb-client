import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  item:DS.belongsTo('nursingprojectitem'),//护理项目
  yearTab:DS.attr('number'),//年
  weekTab:DS.attr('number'),//周几
  weekIndex:DS.attr('number'),//周序号
  startTimeTab:DS.attr('string'),//开始服务时间小时标记字段
  customer:DS.belongsTo('customer'),//老人
  plan:DS.belongsTo('customernursingplan'),
  dayPlanNum:DS.attr('number'),//日项目数
  weekPlanNum:DS.attr('number'),//周项目数
  weekCounts:DS.attr('number'),//周项目次数
});
