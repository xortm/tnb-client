import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  code: DS.attr('string'),
  value:DS.attr('number'),//值
  remark:DS.attr('string'),//备注
});
