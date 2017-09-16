import Ember from 'ember';

export default Ember.Controller.extend({
mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    editCustomer:function(busiTask) {
      var taskId = busiTask.get("id");
      this.get("mainController").switchMainPage('publish-task',{task_id:taskId});
    },
  }

});
