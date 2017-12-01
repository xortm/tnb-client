import DS from 'ember-data';
import BaseModel from './base-model';

var Serviceexe = BaseModel.extend({
  drugExe:DS.belongsTo('customerdrugprojectexe'),
  itemExe:DS.belongsTo('nursingplanexe'),
  dateTabString:DS.attr('string'),
});
export default Serviceexe;
