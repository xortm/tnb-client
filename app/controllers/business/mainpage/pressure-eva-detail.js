import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    selectModel(eva){
      if(eva.get('hasShow')){
        eva.set('hasShow',false);
      }
      else{
        eva.set('hasShow',true);
      }
    },
  }
});
