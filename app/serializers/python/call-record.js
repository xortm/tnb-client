import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  keyForRelationship: function(attr) {
    return Ember.String.singularize(attr);
  },
  payloadKeyFromModelName: function(modelName) {
    return Ember.String.singularize(modelName);
  },
});
