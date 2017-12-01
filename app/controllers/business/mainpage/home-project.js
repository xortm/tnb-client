import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  dataLoader:Ember.inject.service('data-loader'),
  actions:{
    toDetailPage(service){
      console.log("service1111",service);
      let serviceSource = this.get('dataLoader').findDict('jujia');
      let _self = this;
      if(service){
        let id = service.get('id');
        this.get("mainController").switchMainPage('home-project-detail',{id:id,editMode:"edit"});
      }else{
        let newService = this.store.createRecord('customerserviceitem',{});
        newService.set('delStatus',1);
        newService.set('name','');
        newService.set('serviceSource',serviceSource);
        newService.save().then(function(newService){
          _self.get("mainController").switchMainPage('home-project-detail',{editMode:"add",id:newService.get('id')});
        });

      }
    },
  }
});
