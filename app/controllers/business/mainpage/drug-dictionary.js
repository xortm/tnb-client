import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    toDetailPage(drug){
      if(drug){
        let id=drug.get('id');
        this.get("mainController").switchMainPage('drug-detail',{id:id,editMode:"edit"});
      }else{
        this.get("mainController").switchMainPage('drug-detail',{editMode:"add",id:''});
      }
    },
  }
});
