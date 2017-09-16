import Ember from 'ember';

export default Ember.Route.extend({
  actions:{
    sendMesAction:function(value) {
      // var message = {};
      // message.code = this.get('msgCode');
      // message.type = this.get('msgType');
      // message.detailType = this.get('msgDetailType');
      // message.content = {};
      // message.content.taskId = this.get('msgTaskId');
      // message.content.targetNumber = this.get('targetNumber');
      // message.content.myNumber = this.get('myNumber');
      // message.content.customerId = this.get('customerId');
      // message.content.customerName = this.get('customerName');
      // message.content.callId = this.get('callId');
      var message = {
        code:2301,
        type:3,
        // detailType:"callInBusy",
        content:{
          taskId:2,
          targetNumber:'15301078392',
          myNumber:'13310255555',
          customerId:1,
          customerName:"张晓峰",
          // callId:10
        },
        // createTime:"1467947497"
      };
      message.content.callId = value;
      console.log('message is:',message);
      var messageStr = JSON.stringify(message);
      var event = {};
      event.data = messageStr;
      this.get('global_notification').myMessageHandler(event);
    }
  }
});
