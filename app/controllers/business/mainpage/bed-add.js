import Ember from 'ember';

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    
    cancelAdd(){
      this.set('room','');
      this.set('name','');
      this.set('price','');
      this.set('building','');
      this.set('floor','');
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('bed-management');
    },
    selectParent(room) {
        this.set('parent', room);
    }
  }
});
