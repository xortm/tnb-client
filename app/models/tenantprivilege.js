import DS from 'ember-data';

export default DS.Model.extend({
  privilege: DS.belongsTo('privilege'),
  tenantId:DS.attr('number'),
});
