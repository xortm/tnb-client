import Ember from 'ember';
import {pluralize} from 'ember-inflector';

export default Ember.Mixin.create({

  // add json-api compliant serialization type
  hasSerializeIdsAndTypeOption: function(attr) {
    var option = this.attrsOption(attr);
    return option && option.serialize === 'ids-and-type';
  },

  serializeHasMany: function(snapshot, json, relationship) {
    console.log("serializeHasMany in");
    var attr = relationship.key;
    if (this.noSerializeOptionSpecified(attr)) {
      this._super(snapshot, json, relationship);
      return;
    }
    var includeIds = this.hasSerializeIdsOption(attr);
    var includeIdsAndType = this.hasSerializeIdsAndTypeOption(attr);
    var includeRecords = this.hasSerializeRecordsOption(attr);
    if (includeIdsAndType){
      let serializedKey = this.keyForRelationship(attr, relationship.kind, 'serialize'),
          serializedRecords = snapshot.hasMany(attr, { ids: true }).map(function(id) {
            return { id: id, type: pluralize(relationship.type)};
          });
      if (!json['relationships']) {
        json['relationships'] = {};
      }
      json['relationships'][serializedKey] = { data: serializedRecords };
    } else if (includeIds) {
      let serializedKey = this.keyForRelationship(attr, relationship.kind, 'serialize');
      json[serializedKey] = snapshot.hasMany(attr, { ids: true });
    } else if (includeRecords) {
      this._serializeEmbeddedHasMany(snapshot, json, relationship);
    }
  },

});
