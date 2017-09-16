import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  tenant:DS.belongsTo('tenant'),
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//方案描述
  vender:DS.attr('string'),//厂家
  deviceName:DS.attr('string'),//方案名称
  price:DS.attr('string'),//使用价格
  status:DS.attr('string'),//使用情况
  apiFile:DS.attr('string'),//API文件
  codeInfo:DS.attr('string'),//设备编号
});
