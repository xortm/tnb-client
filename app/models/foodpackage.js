import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  createUser: DS.belongsTo('user'), //创建人
  name:DS.attr('string'),//套餐名称
  foods:DS.hasMany('foodpackageitem'),//套餐菜品
  remark:DS.attr('string'),//说明
});
