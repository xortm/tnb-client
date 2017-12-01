  import DS from 'ember-data';
import BaseModel from './base-model';

var Question = BaseModel.extend({
  content:DS.attr('string'),//问题内容
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//备注
  model:DS.belongsTo('evaluatemodel'),//所属问卷模板
  weight:DS.attr('number'),//权重
  seq:DS.attr('number'),//序号
  answers:DS.hasMany('evaluateanswer'),//
  code:DS.attr('string'),//问题编码
  questionContent:Ember.computed.alias('content'),

});

export default Question;
