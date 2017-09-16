import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  name:DS.attr('string'),//名称标题
  remark:DS.attr('string'),//内容
  type:DS.belongsTo('document-type'),//资料类型
  filePath:DS.attr('string'),//
  file:DS.hasMany('share-document-file'),//附件
});
