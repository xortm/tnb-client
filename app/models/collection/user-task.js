import DS from 'ember-data';
/*用户任务数据，集合数据*/
export default DS.Model.extend({
  task: DS.belongsTo('task'),//对应的任务
  user: DS.belongsTo('user'),//对应的用户
  state:DS.attr('string'),//已接时段
  status:DS.attr('number'),//所接任务状态: 1已接 2已放弃
});
