import DS from 'ember-data';

export default DS.Model.extend({
  items:DS.hasMany('nursingplanitem'),
  remark:DS.attr('string'),
});
