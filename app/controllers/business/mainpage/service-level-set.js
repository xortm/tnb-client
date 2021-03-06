import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  dataLoader:Ember.inject.service('data-loader'),
  actions:{
    toDetailPage(serviceLevel){
      var mainpageController = App.lookup('controller:business.mainpage');
      if(serviceLevel){
        let id=serviceLevel.get('id');
        mainpageController.switchMainPage('service-level-detail',{id:id,editMode:"edit"});
      }else{
        mainpageController.switchMainPage('service-level-detail',{editMode:"add",id:''});
      }
    },
  }

});
