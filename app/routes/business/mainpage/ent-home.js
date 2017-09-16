import Ember from 'ember';
import BaseBusiness from '../base-business';

export default BaseBusiness.extend({
  model() {
    this.set('header_title',"欢迎进入呼叫云");
  },
  setupController: function(controller,model){
    this._super(controller, model);
    this.defineController(controller,model);
    console.log("controller in",controller);
  },

  defineController: function(controller,model){
    controller.reopen({
      mainController: Ember.inject.controller('business.mainpage'),
      switchPage(pageName) {
        this.get("mainController").switchMainPage(pageName);
      },
      actions:{
        qpTest: function() {
          console.log("qpTest in");
          this.get("mainController").switchMainPage("ent-home",{qp:"333"});
        },
        switBusiTask: function() {
          this.switchPage("business-task");
        },
        switStufShow: function() {
          this.switchPage("cs-stuff-show");
        },
        switCall: function() {
          this.switchPage("call-check");
        },
        switWorkorder: function() {
          this.switchPage("workorder-check");
        },
      }

    });
    controller.setProperties(model);
  },
});
