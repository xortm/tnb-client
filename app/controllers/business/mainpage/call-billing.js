import Ember from 'ember';

export default Ember.Controller.extend({
  record: null,
  actions: {
    showDetail(recordId) {
      var _self = this;
      this.store.findRecord('python/call-record', recordId).then(function(record) {
        _self.set('record', record);
      });
    }
  }
});
