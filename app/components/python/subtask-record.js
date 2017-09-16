import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    makeCall(phone) {
      console.log('subtask-table Component send action to subtask-list Controller: phone=' + phone);
      this.sendAction('action', phone);
    },
  }
});
