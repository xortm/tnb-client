import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Recharge = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  createDateTime: DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime: DS.attr('number'),//更改时间
  lastUpdateUser:DS.belongsTo('user'),//更改者id
  remark:DS.attr('string'),//备注
  type:DS.belongsTo('dicttype'),//账户类型( accountType)
  user:DS.belongsTo('user'),//员工id
  customer:DS.belongsTo('customer'),//客户id
  balance:DS.attr('string'),//余额
});
export default Recharge;
