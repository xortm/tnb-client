import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),

  actions:{
      dpShowAction(e) {},
    toDetailPage(department){
        // console.log("department有什么？？",department);
      var mainpageController = App.lookup('controller:business.mainpage');
      if(department){
        let id=department.get('id');
        mainpageController.switchMainPage('department-add-detail',{id:id,editMode:"edit"});
      }else{
        mainpageController.switchMainPage('department-add-detail',{editMode:"add",id:''});
      }
    },
  }

});
