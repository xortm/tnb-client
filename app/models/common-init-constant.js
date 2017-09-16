import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*网站初始化加载数据集合
* author:ytche
*/
export default BaseModel.extend({
  dicttypes:DS.hasMany('dicttype'),
  sysConfig:DS.belongsTo("sysconfig"),
  dicttypeTenants:DS.hasMany("dicttypetenants"),
  serviceFinishLevel:DS.hasMany("servicefinishlevel"),
  beds:DS.hasMany("bed"),
  customers:DS.hasMany("customer"),
  employees:DS.hasMany("employee"),
  appraiseItems:DS.hasMany("appraise-item"),
  confs:DS.hasMany('conf'),
  tenantPrivileges:DS.hasMany('tenantprivilege'),
  privileges:DS.hasMany('privilege'),
  nursingLevels:DS.hasMany('nursinglevel'),
  nursingLevelItems:DS.hasMany('nursinglevelitem'),
  // staffCustomers:DS.hasMany('staffcustomer')
  staffCustomers:DS.hasMany('customer')
});
