import DS from 'ember-data';
/*当前状态信息*/
var Busistatus = DS.Model.extend({
  curLineTask: DS.belongsTo('task'),//当前签入的任务，如果是空说明没有签入
  curCall: DS.belongsTo('call'), //当前的通话
  code:DS.attr('string'),
});
export default Busistatus;
