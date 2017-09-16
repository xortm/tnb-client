import DS from 'ember-data';
import BaseModel from './base-model';


export default BaseModel.extend({
  bed:DS.belongsTo('bed'),//床位
  group:DS.belongsTo('nursegroup'),//护理组
  remark:DS.attr('string'),//备注

});
