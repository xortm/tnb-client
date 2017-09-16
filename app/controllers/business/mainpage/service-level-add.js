import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    showSetLevel:function(){
      this.set('showSetLevel',true);
    },
    hideSetLevel:function(){
      this.set('showSetLevel',false);
    }
  }
});
