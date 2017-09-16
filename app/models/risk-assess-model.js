import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  name:DS.attr('string'),//名称
  createTime:DS.attr('number'),//创建时间
  remark:DS.attr('string'),//描述
  evaluateModels:DS.hasMany('evaluatemodel'),//评估模板
  riskRecordModels:DS.hasMany('risk-record-model'),//记录表模板
  code:DS.attr('string'),//编码
});
