import DS from 'ember-data';

export default DS.Model.extend({
  type:DS.attr('string'),//标识
  jsonData:DS.attr('string')//json数据转为字符串
});
