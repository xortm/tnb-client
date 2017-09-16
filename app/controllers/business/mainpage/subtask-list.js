import Ember from 'ember';
const {callStatus_callWait,callStatus_callFailure,callStatus_calling,callStatus_inCall,callStatus_callEnd,callStatus_callLost,callType_callOprDial} = Constants;

export default Ember.Controller.extend({
  statusService: Ember.inject.service("current-status"),
  // showModal: false,
  showpopCustomerModal: false,
  confirmIdModal: false,
  isDisabled: true,
  toggleModal: function() {
    var showModal = this.get('showModal');
    if(showModal) {
      this.set('showModal', false);
    }else {
      this.set('showModal', true);
    }
  },

  actions: {
    callMess(callId) {
      this.store.findRecord('call',callId,{reload: true }).then(function(call) {
        if(call&&call.get('customer')&&(call.get('customer').get('id'))) {
          var typeCode = call.get('status').get('typecode');
          if(typeCode === callStatus_calling||typeCode === callStatus_callWait) {
            call.get('customer').set('callStatus','fa-phone icon-shine');
          }
          else if (typeCode === callStatus_inCall) {
            call.get('customer').set('callStatus','fa-phone icon-red');
          }
          else {
            call.get('customer').set('callStatus','fa-phone');
          }
        }
      });
    },
    toggle() {
      this.toggleModal();
    },

    closeConfirm() {
      this.set('confirmIdModal',false);
    },

    makeCall(customer) {
      var _self = this;
      // this.set('showModal',true);
      var userTask = this.get("global_curStatus").getTask();
      var curUser = this.get("global_curStatus").getUser();
      this.store.findRecord('userTask',userTask.get('id')).then(function(userTask) {
        _self.store.findRecord('user',curUser.get('id')).then(function(user) {
          _self.store.findRecord('task',userTask.get('task').get('id')).then(function(task) {
            var call = _self.get("global_curStatus").getCall();
            console.log('curCall',call);
            if(call&&call.get('status')) {
              var typeCode = call.get('status').get('typecode');
              console.log('typeCode',typeCode);
              if(typeCode === callStatus_callFailure||typeCode === callStatus_callEnd||typeCode === callStatus_callLost) {
                customer.set('callStatus','fa-phone icon-shine');
                _self.set('responseCode',1);
              }
              else {
                _self.set('responseCode',0);//responseCode:0存在正在进行的通话，1不存在
                console.log('customerNumber',call.get('customerNumber'),customer.get('phone'));
                if(call.get('customerNumber') == customer.get('phone')) {
                  // _self.set('showModal',call);
                  // _self.set('responseInfo',call.get('status').get('typename')+'......');
                  // if(typeCode === callStatus_callWait) {
                  //   _self.set('responseInfo','等待接听......');
                  // }
                  // else if (typeCode === callStatus_calling) {
                  //   _self.set('responseInfo','拨号中......');
                  // }
                  // else if (typeCode === callStatus_inCall) {
                  //   _self.set('responseInfo','通话中......');
                  // }
                }
                else {
                  _self.set('showModal',true);
                  _self.set('responseInfo','有正在进行中的通话......');
                }
              }
            }
            else {
              customer.set('callStatus','fa-phone icon-shine');
              _self.set('responseCode',1);
            }
            if(_self.get('responseCode')) {//没有正在进行的通话，则可以拨打
              _self.store.query('dicttype',{filter:{'typecode@$or1---1':callStatus_calling,'typecode@$or1---2':callType_callOprDial}}).then(function(dictTypes) {

                // _self.set('responseInfo','开始拨号......');
                dictTypes.forEach(function(dicttype) {
                  if(dicttype.get('typecode') === callStatus_calling) {
                    _self.set('statusDict',dicttype);
                  }
                  if(dicttype.get('typecode') === callType_callOprDial) {
                    _self.set('operationDict',dicttype);
                  }
                });
                var newCall = _self.store.createRecord('call',{});
                newCall.set('callingNumber',userTask.get('bindPhone'));
                newCall.set('calledNumber',customer.get('phone'));
                newCall.set('direction',2);
                newCall.set('status',_self.get('statusDict'));
                newCall.set('operation',_self.get('operationDict'));
                newCall.set('customer',customer);
                newCall.set('agent',user);
                newCall.set('task',task);
                console.log('new call save',newCall);
                _self.get("global_curStatus").setCall(newCall);
                // _self.set('showModal',newCall);
                newCall.save().then(function() {
                });
              });
            }
          });
        });
      });
    },
  }
});
