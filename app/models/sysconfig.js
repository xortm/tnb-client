import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  sysTime: DS.attr('number'),
});
