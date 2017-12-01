import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  diningTime: DS.belongsTo('dicttype'), //用餐时间 foodTimeType:  foodTimeType1 早餐   foodTimeType3午餐  foodTimeType5晚餐
  food:DS.belongsTo('food'),//选中菜单关联
  foodPackage:DS.belongsTo('foodpackage'),//关联套餐总表foodpackage
  createUser: DS.belongsTo('user'), //创建人
});
