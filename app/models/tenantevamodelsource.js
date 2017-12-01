import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
    tenant:DS.belongsTo('tenant'),//所属租户
    modelSource:DS.belongsTo('evaluatemodelsource'),//所属规范
});
