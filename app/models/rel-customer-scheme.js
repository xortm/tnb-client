import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  customer:DS.belongsTo('customer'),//用户
  scheme:DS.belongsTo('scheme'),//方案

});
