import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  dataLoader:Ember.inject.service('data-loader'),
  actions:{
    toDetailPage(service){
      console.log("service1111",service);
      let _self = this;
      let serviceSource = this.get('dataLoader').findDict('jigou');
      if(service){
        let id = service.get('id');
        if(service.get("countType.typecode")=='countTypeByTime'){
          this.get("mainController").switchMainPage('service-detail',{id:id,editMode:"edit",countT:'1'});
        }else {
          this.get("mainController").switchMainPage('service-detail',{id:id,editMode:"edit",countT:''});
        }
      }else{
        let newService = this.store.createRecord('customerserviceitem',{});
        newService.set('delStatus',1);
        newService.set('name','');
        newService.set('serviceSource',serviceSource);
        newService.save().then(function(newService){
          _self.get("mainController").switchMainPage('service-detail',{editMode:"add",id:newService.get('id')});
        });

      }
    },
  }
});
