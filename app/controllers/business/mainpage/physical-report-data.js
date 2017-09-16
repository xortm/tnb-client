import Ember from 'ember';

export default Ember.Controller.extend({
  searchInput:null,
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    search(searchInput){
      App.lookup("route:business.mainpage.physical-report-data").doQuery();
    },
    //跳转至编辑页
    toDetailPage(report){
      if(report){
        let id=report.get('id');
        this.get("mainController").switchMainPage('physical-report-data-detail',{id:id,editMode:"edit"});
      }else{
        this.get("mainController").switchMainPage('physical-report-data-detail',{editMode:"add"});
      }
    },
  }
});
