import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  createDateTime:DS.attr('number'),//创建时间
  remark:DS.attr('string'),//备注
  name:DS.attr('string'),//名称
  unit:DS.attr('string'),//单位
  goodsType:DS.belongsTo('dicttype'),//物品类型
});
