import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showDetail(recordId) {
      this.sendAction('action', recordId);
    }
  }
});
