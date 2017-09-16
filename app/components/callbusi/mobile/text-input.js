import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    saveValue(field){
      console.log('保存的数据：',field.value);
      this.sendAction('saveValue',field);
    }
  }

});
