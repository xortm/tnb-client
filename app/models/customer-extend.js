import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  remark0: DS.attr('string'), //个人特点
  remark1: DS.attr('string'),
  remark2: DS.attr('string'),
  remark3: DS.attr('string'),
  remark4: DS.attr('string'),
  remark5: DS.attr('string'),
  remark6: DS.attr('string'),
  remark7: DS.attr('string'),
  remark8: DS.attr('string'),
  remark9: DS.attr('string'),
  characteristic0: DS.attr('string'), //基本信息
  characteristic1: DS.attr('string'),
  characteristic2: DS.attr('string'),
  characteristic3: DS.attr('string'),
  characteristic4: DS.attr('string'),
  characteristic5: DS.attr('string'),
  characteristic6: DS.attr('string'),
  characteristic7: DS.attr('string'),
  characteristic8: DS.attr('string'),
  characteristic9: DS.attr('string'),

  customer: DS.belongsTo("customer"),
  interest: DS.attr('string'), //兴趣爱好
  dietFeatures: DS.attr('string'), //饮食特点
  character: DS.attr('string'),//性格提点
  taboo: DS.attr('string'), //反感忌讳
  experiences: DS.attr('string')//人生经历
});
