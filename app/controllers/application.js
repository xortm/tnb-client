import Ember from 'ember';

export default Ember.Controller.extend({
  statusService: Ember.inject.service("current-status"),
  pageConstucture: Ember.inject.service("page-constructure"),

  actions:{
    saveErrorClose(){
      console.log("run in saveErrorClose");
      this.get("statusService").set("saveErrorFlag",false);
    },
  },
});
