import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    //查询条件：通过项目类型来查询
    serviceTypeSelect(serviceType){
      if(serviceType){
        this.set('serviceTypeID',serviceType.get('id'));
      }else{
        this.set('serviceTypeID','');
      }
      App.lookup("route:business.mainpage.nursing-service-management").doQuery();
    },

    toDetailPage(service){
      console.log("service1111",service);
      if(service){
        let id = service.get('id');
        if(service.get("countType.typecode")=='countTypeByTime'){
          this.get("mainController").switchMainPage('nursing-service-detail',{id:id,editMode:"edit",countT:'1'});
        }else {
          this.get("mainController").switchMainPage('nursing-service-detail',{id:id,editMode:"edit",countT:''});
        }
      }else{
        this.get("mainController").switchMainPage('nursing-service-detail',{editMode:"add",id:'',countT:''});
      }
    },
  }
});
