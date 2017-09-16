//export { default } from 'ember-local-storage/serializers/serializer';
import DS from 'ember-data';
export default DS.FirebaseSerializer.extend({
  // Serialization behavior
  //_shouldSerializeHasMany: function() { return true; }
});
