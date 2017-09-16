import Ember from 'ember';

export default Ember.Component.extend({
  name: '',
  phone: '',
  actions: {
    querySubtask() {
      var name = this.get('name');
      var phone = this.get('phone');
      this.sendAction('action', {name: name, phone: phone});
    }
  }
});
