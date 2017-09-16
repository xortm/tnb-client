import DS from 'ember-data';
import BaseModel from './base-model';


export default BaseModel.extend({
  employee:DS.belongsTo('employee'),//床位
  group:DS.belongsTo('nursegroup'),//护理组
  remark:DS.attr('string'),//备注
});
