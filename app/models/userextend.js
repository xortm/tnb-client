import DS from 'ember-data';
import BaseModel from './base-model';
/*
 * 用户扩展信息

 */
export default BaseModel.extend({
  taskNumber: DS.attr('number'),//任务数
  callNumber: DS.attr('number'),//呼叫数量

  rate: DS.attr('number'),//信誉(好评率)
  workHour:DS.attr('number'),//客服经验（小时数）
  score:DS.attr('number'),//等级：评分
  level:DS.belongsTo('dicttype'),//等级：金牌银牌。。。
  // lateRate: DS.attr('number'),//迟到率
});
