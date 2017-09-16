import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  name:DS.attr('string'),//名称
  remark:DS.attr('string'),//描述
  riskModel:DS.belongsTo('risk-assess-model'),//所属模板
  fields:DS.hasMany('risk-record-field'),//拥有的字段
});
