import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  healths:DS.hasMany('health-info'),
  remark:DS.attr('string'),
});
