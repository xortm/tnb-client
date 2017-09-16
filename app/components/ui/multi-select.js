import Ember from 'ember';

export default Ember.Component.extend({
  title:{},
  selectContext:[],


  actions:{
    isSelected: function (title,item) {
      item.selected=!item.selected;
      this.sendAction('isSelected',title,item);
    },
  }

});
