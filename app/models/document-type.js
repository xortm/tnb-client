import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  name:DS.attr('string'),//类型名称
  parent:DS.attr('document-type'),//上级对应类型
  level:DS.attr('number'),//级别
});
