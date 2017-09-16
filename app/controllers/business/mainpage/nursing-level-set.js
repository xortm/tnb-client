import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),

  actions:{
    toDetailPage(serviceLevel){
      var mainpageController = App.lookup('controller:business.mainpage');
      
      if(serviceLevel){
        let id=serviceLevel.get('id');
        mainpageController.switchMainPage('nursing-level-detail',{id:id,editMode:"edit"});
      }else{
        mainpageController.switchMainPage('nursing-level-detail',{editMode:"add",id:''});
      }
    },
  }

});
