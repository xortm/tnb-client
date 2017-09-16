import Adapter from 'ember-local-storage/adapters/adapter';
export default Adapter.extend({
  // _debug: true,
  modelNamespace: 'localstorage',

  pathForType: function(type) {
    // console.log("host iss:" + this.host);
    // console.log("local pathForType in:" + type + " and camelize:" + Ember.String.camelize(type));
    return Ember.String.camelize(type);
  },

});
