import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  bed:DS.belongsTo('bed'),//床位
  setting:DS.belongsTo('worktimesetting'),//班次

});
