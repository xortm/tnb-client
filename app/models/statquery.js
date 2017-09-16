import DS from 'ember-data';

export default DS.Model.extend({
  /*查询条件相关*/
  statType:DS.belongsTo('dicttype'),//统计类型
  durType:DS.attr('number'),//统计区间,1:年 2季 3月 4周 5日
  beginTime:DS.attr('number'),//开始日期
  endTime:DS.attr('number'),  //结束日期
  /*查询结果相关*/
  statResult: DS.attr('number'),//结果数据
  statItemType:DS.belongsTo('dicttype'),//口径类型
  statDate:DS.attr('number'),//结果日期
});
