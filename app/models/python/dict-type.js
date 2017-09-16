import Model from 'ember-data/model';
import Ember from 'ember';

export default Model.extend({
  code: DS.attr('string'),
  name: DS.attr('string'),
  type: DS.attr('number'),
  success: Ember.computed('code', function() {
    return this.get('code') === 'success' ? true : false;
  })
});
