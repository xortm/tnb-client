import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  role:DS.belongsTo('role',{inverse:'items'}),
  item:DS.belongsTo('customerserviceitem'),
});
