import Model from 'ember-data/model';

export default Model.extend({
  name: DS.attr('string'),
  phone: DS.attr('string'),
  state: DS.belongsTo('python/dict-type')
});
