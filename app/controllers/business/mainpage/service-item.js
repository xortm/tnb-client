import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    toDetailPage(service){
      console.log("service1111",service);
      if(service){
        let id = service.get('id');
        if(service.get("countType.typecode")=='countTypeByTime'){
          this.get("mainController").switchMainPage('service-detail',{id:id,editMode:"edit",countT:'1'});
        }else {
          this.get("mainController").switchMainPage('service-detail',{id:id,editMode:"edit",countT:''});
        }
      }else{
        this.get("mainController").switchMainPage('service-detail',{editMode:"add",id:'',countT:''});
      }
    },
  }
});
