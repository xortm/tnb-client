import Model from 'ember-data/model';
// import Ember form 'ember';
// import DS from 'ember-data';

export default Model.extend({
  name: DS.attr('string'),
  phone: DS.attr('number'),
  callRecords: DS.hasMany('python/call-record')
});
