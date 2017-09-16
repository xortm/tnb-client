import Ember from 'ember';

export default Ember.Controller.extend({
  actions:{
    toDevice(type){
      let code = type.get('code');
      let mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('device-detail',{code:code});
    }
  }

});
