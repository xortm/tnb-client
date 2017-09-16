import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  name:DS.attr('string'),//标题
  remark:DS.attr('string'),//备注
  document:DS.belongsTo('share-document'),//所属资料
  path:DS.attr('string'),//路径
});
