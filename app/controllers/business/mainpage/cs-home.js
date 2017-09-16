import Ember from 'ember';

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  global_curStatus: Ember.inject.service("current-status"),
  switchPage(pageName) {
    this.get("mainController").switchMainPage(pageName);
  },
  initWidth(){
   var maincontent=($("#main-content").height());
   console.log('maincontent:height',maincontent);
   $('#homePage').height(maincontent);
  },
  getJujia(){
    var isJusjia=this.get("global_curStatus.isJujia");
    console.log('jujia is',isJusjia);
    if(isJusjia){
      this.set('jujia',true);
    }else {
      this.set('jujia',false);
    }
  },
  actions:{
    qpTest: function() {
      console.log("qpTest in");
      this.get("mainController").switchMainPage("cs-home",{qp:"333"});
    },
    switLineuse: function() {
      this.switchPage("lineuse");
    },
    switWorkManage: function() {
      this.switchPage("workorder-management");
    },
    switSquare: function() {
      this.switchPage("task-square");
    },
    switMine: function() {
      this.switchPage("task-mine");
    },
  }
});
