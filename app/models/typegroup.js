import DS from 'ember-data';

export default DS.Model.extend({
  typegroupcode:DS.attr('string'),
  typegroupname:DS.attr('string'),
});
