import DS from 'ember-data';
import BaseModel from './base-model';

var Specservice = BaseModel.extend({
  project:DS.belongsTo('customerdrugprojectitem'),//  用药计划的上一级
  drugExe:DS.belongsTo('customerdrugprojectexe'),
  item:DS.belongsTo('nursingplandetail'),//定时服务
  projectItem:DS.belongsTo('nursingprojectitem'),//不定时任务
  itemExes:DS.hasMany('nursingplanexe'),
});
export default Specservice;
