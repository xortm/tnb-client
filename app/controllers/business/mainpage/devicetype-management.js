import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),

  actions:{
    toDetailPage(device){
      var mainpageController = App.lookup('controller:business.mainpage');
      if(device){
        let id=device.get('id');
        mainpageController.switchMainPage('devicetype-detail',{id:id,editMode:"edit"});
      }else{
        mainpageController.switchMainPage('devicetype-detail',{editMode:"add",id:''});
      }
    },
  }

});
