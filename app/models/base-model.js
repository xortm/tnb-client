import DS from 'ember-data';

export default DS.Model.extend({
  errcode: DS.attr('string'),//错误代码
  delStatus:DS.attr('number'),//删除状态 1已删除0未删除
  url:DS.attr("string"),//导出excel的下载路径
  oneToManyFlag:DS.attr("number"), //是否是一对多查询,0否1是

  // tenant:DS.belongsTo('tenant'),

  page_errors: Ember.Object.create({}),//校验的错误信息
  page_errorsCnt:0,
});
