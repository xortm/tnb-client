import DS from 'ember-data';
import BaseModel from './base-model';

var DrugFormType = BaseModel.extend({
  name:DS.attr('string'),//药剂名称
  code:DS.attr('string'),//药剂编码
  level:DS.attr('number'),//药剂级别
  partent:DS.belongsTo('drugFormType'),//parentId
});

export default DrugFormType;
