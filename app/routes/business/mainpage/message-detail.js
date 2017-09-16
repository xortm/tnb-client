import Ember from 'ember';
import BaseBusiness from '../base-business';
export default BaseBusiness.extend({
  statusService: Ember.inject.service("current-status"),
  queryParams: {
      messageId: {
          refreshModel: true
      },
  },
  model(){
  },
  setupController: function(controller,model){
    this._super(controller,model);
    //获取居家curCustomer
    var curCustomer = this.get("statusService").getCustomer();
    console.log("curCustomer in setupController",curCustomer);
    controller.set("curCustomer",curCustomer);
    //获取messageid
    // var id=this.getCurrentController().get('messageId');
    // var id = controller.get("messageId");
    // console.log("message id",id);
    // let message = this.store.peekRecord('message',id);
    // controller.set('message',message);
    // console.log('message content',message.get("content"));
  },

});
