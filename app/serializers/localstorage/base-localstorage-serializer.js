import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.camelize(attr);
  },
  keyForRelationship: function(attr) {
    var tarAttr = Ember.String.singularize(attr);
    // console.log("ori attr:" + attr + " and tarAttr:" + tarAttr);
    return attr;
  },
  // modelNameFromPayloadKey: function(attr) {
  //   console.log("model key ori:" + attr);
  //   return Ember.String.camelize(attr);
  // },
  payloadKeyFromModelName: function(modelName) {
    // console.log("modelName:" + modelName);
    return Ember.String.camelize(Ember.String.singularize(modelName));
  },
});
