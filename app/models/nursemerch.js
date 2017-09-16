import DS from 'ember-data';
import BaseModel from './base-model';

var Building = BaseModel.extend({
  name:DS.attr('string'),//名称
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//备注
  price:DS.attr('number'),//价格
  code:DS.attr('string'),//编号
  type:DS.belongsTo('dicttype'),//类型
  merchUnit:DS.belongsTo('dicttype'),//单位
});

export default Building;
