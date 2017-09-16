import DS from 'ember-data';

export default DS.Model.extend({
  statType:DS.belongsTo('dicttype'),//统计类型
  statItem:DS.belongsTo('dicttype'),//口径类型  
});
