import DS from 'ember-data';
import BaseModel from './base-model';

var staffcustomer = BaseModel.extend({
  staff:DS.belongsTo('user'),
  customer:DS.belongsTo('customer'),
  remark: DS.attr('string'),
  delStatus:DS.attr('number'),
});
export default staffcustomer;
