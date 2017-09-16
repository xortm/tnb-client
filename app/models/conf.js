import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  code:DS.attr('string'),//
  value:DS.attr('string'),
  remark:DS.attr('string'),

});
