import Ember from 'ember';

export default Ember.Controller.extend({
  searchInput:null,
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    search(searchInput){
      App.lookup("route:business.mainpage.evaluation-report").doQuery();
    },
    //跳转至编辑页
    toDetailPage(report){
      if(report){
        let id=report.get('id');
        this.get("mainController").switchMainPage('evaluation-report-detail',{id:id,editMode:"edit"});
      }else{
        this.get("mainController").switchMainPage('evaluation-report-detail',{editMode:"add"});
      }
    },
  }
});
