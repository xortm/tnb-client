import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    //暂存
    stagingAction(){
      let mainpageController = App.lookup('controller:business.mainpage');
      let from = this.get('from');
      let businessflow = this.get('customerbusinessflowInfo');
      businessflow.set('tempFlag',1);
      businessflow.save().then(function(){
        App.lookup('controller:business.mainpage').openPopTip("已暂存");
        App.lookup('controller:business.mainpage').showPopTip("已暂存");
        if(from){
          mainpageController.switchMainPage('try-and-stay');
        }else{
          mainpageController.switchMainPage('business-customer');
        }
      }
      );
    },
    //下一步
    goNext(customer){
      let id = this.get('id');
      let from = this.get('from');
      this.set('customer',customer);
      this.get('customer').save().then(function(){
        let mainpageController = App.lookup('controller:business.mainpage');
        if(from){
          mainpageController.switchMainPage('checkin',{editMode:"add",id:id,add:true,from:from});
        }else{
          mainpageController.switchMainPage('checkin',{editMode:"add",id:id,add:true});
        }

      });
    },

  }
});
