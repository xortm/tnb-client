import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  remark: DS.attr('string'), //备注
  plans:DS.hasMany('cutomer-food-plan'),//所对应用餐计划详情
  zaoFoods:DS.hasMany('food'),//早餐菜谱
  zhongFoods:DS.hasMany('food'),//中餐菜谱
  wanFoods:DS.hasMany('food'),//晚餐菜谱
});
