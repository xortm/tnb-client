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
  // serializeHasMany: function(snapshot, json, relationship) {
  //   // console.log("relationship in serializeHasMany",relationship);
  // },
  extractId: function(modelClass, resourceHash){
    if(resourceHash.id==="null"){
      console.log("need set id null");
      resourceHash.id = null;
    }
    return this._super(modelClass, resourceHash);
  },
  // modelNameFromPayloadKey: function(attr) {
  //   console.log("model key ori:" + attr);
  //   return Ember.String.camelize(attr);
  // },
  payloadKeyFromModelName: function(modelName) {
    console.log("modelName:" + modelName + " and signle:" + Ember.String.singularize(modelName));
    return Ember.String.camelize(Ember.String.singularize(modelName));
  }
});
