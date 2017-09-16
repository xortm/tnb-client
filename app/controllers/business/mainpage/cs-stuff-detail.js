import Ember from 'ember';
import csInviteItem from './cs-stuff-show';
const { taskApplyStatus_applyFail,taskApplyStatus_refuseInvitation,taskApplyStatus_SuccNotLocateSeat} = Constants;

export default csInviteItem.extend({
  ageInfo: true,
  showDetail: false,
  taskApplyEvent: function(user,taskApplyStatus) {
    var self = this;
    var curTask = this.get("global_curStatus").getTask();
    self.get("store").query('dicttype', {filter: {typecode: taskApplyStatus}}).then(function (dicttypes) {
      var dicttype = dicttypes.get("firstObject");
      self.store.query("user-task", {filter:{task:{id:curTask.get('id')},user:{id:user.get('id')}}}).then(function(userTasks) {
        var userTaskEnt = userTasks.get("firstObject");
        userTaskEnt.set("status", dicttype);
        if(taskApplyStatus === taskApplyStatus_SuccNotLocateSeat) {
          // userTaskEnt.get('user').set('csStatus','已通过(未分配坐席)');
          self.get("global_ajaxCall").set("action","approved");
        }
        else {
          if(self.get('refuseInfo')) {
            userTaskEnt.set("verifyFailReason", self.get('refuseInfo'));
          }
          // userTaskEnt.get('user').set('csStatus','已拒绝申请');
          self.get("global_ajaxCall").set("action","notApproved");
        }
        userTaskEnt.save().then(function(usertask) {
          if(taskApplyStatus === taskApplyStatus_SuccNotLocateSeat&&usertask.get('errcode')&&usertask.get('errcode') == 1) {
            self.set('alertModal',true);
						self.set('alertInfo','该任务的已招客服人数已经到达需求上限，如要增加人数，请联系运营人员4000-911-777');
            user.set('disabled',false);
          }
          else {
            userTaskEnt.get('user').set('statusName',dicttype.get('typename'));
            userTaskEnt.get('user').set('changeStatus',false);
            if(taskApplyStatus === taskApplyStatus_SuccNotLocateSeat) {
              userTaskEnt.get('user').set('csStatus','已通过(未分配坐席)');
            }
            else {
              userTaskEnt.get('user').set('csStatus','已拒绝申请');
            }
          }
        },function() {
          self.set('alertModal',true);
          self.set('alertInfo','请求失败~');
          user.set('disabled',false);
        });
      },function() {
        self.set('alertModal',true);
        self.set('alertInfo','请求失败~');
        user.set('disabled',false);
      });
    },function() {
      self.set('alertModal',true);
      self.set('alertInfo','请求失败~');
      user.set('disabled',false);
    });
  },

  actions: {
    closeAlert: function(){
			this.set("alertModal",false);
		},
    cancelPassSubmit: function(){
      this.get('user').set('disabled',false);
			this.set("showpopInvitePassModal",false);
		},
    agreeApply: function (csuser) {
      csuser.set('disabled',true);
      this.taskApplyEvent(csuser,taskApplyStatus_SuccNotLocateSeat);
    },
    refuseApply: function (csuser) {
      csuser.set('disabled',true);
      this.set('showpopInvitePassModal',true);
    },
    refuseCsUser: function (csuser) {
      this.set("showpopInvitePassModal",false);
      this.taskApplyEvent(csuser,taskApplyStatus_applyFail);
    },
    sendMessage: function (){
      this.set('showsendMessageModel',true);
    },
    sendTheMessage:function(){
      var _self = this;
      var curUser = this.get("global_curStatus").getUser();
      var userId = this.get('user_id');
      console.log("kefuID",userId);
      console.log("dangqianID",curUser.get("id"));
      var dialogue = this.get("dialogue");
      console.log("haha",dialogue);
      var message = this.store.createRecord('message',{});
      if (dialogue && dialogue.replace(/\s+/,'')) {
        this.store.findRecord("user",curUser.get("id")).then(function(fromUser){
          message.set('fromUser',fromUser);
          console.log("curUserformUser",fromUser);
          _self.store.findRecord("user",userId).then(function(toUser){
            message.set('toUser',toUser);
            console.log("curUserformUser",toUser);
            message.set('type',"1");
            message.set('hasRead',"0");
            console.log("save1111111",message);
            message.set('content',dialogue);
            message.save().then(function() {
              _self.set("dialogue","");
              _self.set('showsendMessageModel',false);
            });
          });
        });
      }
    },
    cancelSubmit:function(){
      this.set('showsendMessageModel',false);
    },
  }
});
