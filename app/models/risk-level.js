import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  levelName:DS.attr('string'),//名称
  remark:DS.attr('string'),//描述
  level:DS.attr('string'),//等级
  assess:DS.belongsTo('risk-assess-model'),//风险评估模板
  minScore:DS.attr('number'),//最低分
  maxScore:DS.attr('number'),//最高分

});
