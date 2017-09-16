import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    toNextPage(parent){
      this.sendAction('toNextPage',parent);
    },
    saveValue(field){
      this.sendAction('saveValue',field);
    },
    chooseItem(item){
      this.sendAction('chooseItem',item);
    }
  }
});
