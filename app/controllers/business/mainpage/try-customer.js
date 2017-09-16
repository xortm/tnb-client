import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    stagingAction(){
      let _self = this;
      let businessflow = this.get('customerbusinessflowInfo');
      businessflow.set('tempFlag',1);
      businessflow.save().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("已暂存");
        App.lookup('controller:business.mainpage').showPopTip("已暂存");
      }
      );
    },
    goNext(customer){
      let id = this.get('id');
      this.set('customer',customer);
      this.get('customer').save().then(function(){
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('try',{editMode:"add",id:id,add:true});
      });
    },

  }
});
