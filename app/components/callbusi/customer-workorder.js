import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    saveCustomer(customer){
      this.sendAction('saveCustomer', customer);
    },
    saveWorkorder(workorder){
      this.sendAction('saveWorkorder', workorder);
    }
  }
});
