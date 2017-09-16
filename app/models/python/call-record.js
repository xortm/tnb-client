import Model from 'ember-data/model';

export default Model.extend({
  callId: DS.attr('string'),
  callingNumber: DS.attr('string'),
  calledNumber: DS.attr('string'),
  direction: DS.belongsTo('python/dict-type'),
  beginTime: DS.attr('string'),
  endTime: DS.attr('string'),
  duration: DS.attr('number'),
  operation: DS.belongsTo('python/dict-type'),
  state: DS.belongsTo('python/dict-type'),
  customer: DS.belongsTo('python/customer'),
  agent: DS.belongsTo('python/agent')
});
