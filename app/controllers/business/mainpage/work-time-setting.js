import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    toWorkTimeSettingDetailPage(worktimesetting){
      if(worktimesetting){
        let id=worktimesetting.get('id');
        this.get("mainController").switchMainPage('work-time-setting-detail',{id:id,editMode:"edit"});
      }else{
        this.get("mainController").switchMainPage('work-time-setting-detail',{id: "",editMode:"add"});
      }
    },
  }
});
