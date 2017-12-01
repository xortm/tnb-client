import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  food:DS.belongsTo('food'),//所属菜谱
  plan:DS.belongsTo('customer-food-plan'),//所属计划
  remark:DS.attr('string'),//说明
});
