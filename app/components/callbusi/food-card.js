import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    choosed(plan){
      console.log('choosed in component food-card');
      this.sendAction('choosed',plan);
    }
  }
});
