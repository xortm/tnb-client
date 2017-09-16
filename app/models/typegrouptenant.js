import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var dicttypetenant = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  typegroupcode: DS.attr('string'),//编码
  typegroupname: DS.attr('string'),//名称
  remark: DS.attr('string'),//备注
  // tenant:DS.belongsTo('Tenant'),//租户
});
export default dicttypetenant;
