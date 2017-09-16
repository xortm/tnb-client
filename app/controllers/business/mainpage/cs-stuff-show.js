import Ember from 'ember';
const { taskApplyStatus_applyFail,taskApplyStatus_refuseInvitation,taskApplyStatus_invited,taskInviteStatus_inviteFail,taskInviteStatus_invite} = Constants;

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  showDetail: true,
  createTaskInvitation:function(csuser,task,status,remark) {
    var newInvitation = this.store.createRecord('task-invitation', {});
    newInvitation.set('customerService',csuser);
    newInvitation.set('task',task);
    newInvitation.set('status',status);
    newInvitation.set('remark',remark);
    newInvitation.save().then(function(inviteData) {
      csuser.set("isInvite",true);
      csuser.set("inviteStatus",inviteData.get('status').get('typename'));
    });
  },
  actions: {
    /*客服详情*/
    enterDetail: function(csuser) {
      var cid = csuser.get("id");
      this.get("mainController").switchMainPage('cs-stuff-detail',{detail_type:1,user_id:cid});
      // this.transitionToRoute("/business/mainpage/cs-stuff-detail/show/" + cid);
    },
    /*邀请*/
    invitation: function(csuser,remark) {
      var _self = this;
      var curTask = this.get("global_curStatus").getTask();
      this.store.find('task',curTask.get("id")).then(function(taskrecord){
        _self.store.query('user-task',{filter:{user:{id:csuser.get('id')},task:{id:taskrecord.get('id')}}}).then(function(userTasks) {
          var userTask = userTasks.get('firstObject');
          _self.get("store").query('dicttype', {filter: {'typecode@$or1---1': taskApplyStatus_invited,'typecode@$or1---2': taskInviteStatus_invite}}).then(function(dicttypes) {
            var dicttype;//userTask已邀请
            var dict;//taskInvitation已邀请
            dicttypes.forEach(function(dic) {
              if(dic.get('typecode') === taskApplyStatus_invited) {
                dicttype = dic;
              }
              if(dic.get('typecode') === taskInviteStatus_invite) {
                dict = dic;
              }
            });
            if(userTask) {
              if(userTask.get('status').get('typecode') === taskApplyStatus_applyFail||userTask.get('status').get('typecode') === taskApplyStatus_refuseInvitation) {
                _self.get("store").query('task-invitation', {filter: {customerService:{id:csuser.get('id')},task:{id:taskrecord.get('id')}}}).then(function (taskInvites) {
                  var taskInvite = taskInvites.get("firstObject");
                  if(taskInvite) {
                    if(taskInvite.get('status').get('typecode') === taskInviteStatus_inviteFail) {
                      userTask.set('status',dicttype);
                      userTask.save().then(function() {
                        taskInvite.set('status',dict);
                        taskInvite.set('remark',remark);
                        taskInvite.save().then(function(inviteData) {
                          csuser.set("isInvite",true);
                          csuser.set("inviteStatus",inviteData.get('status').get('typename'));
                        });
                      });
                    }
                    else {
                      userTask.set('status',dicttype);
                      userTask.save().then(function() {
                        _self.createTaskInvitation(csuser,taskrecord,dict,remark);
                      });
                    }
                  }
                  else {
                    userTask.set('status',dicttype);
                    userTask.save().then(function() {
                      _self.createTaskInvitation(csuser,taskrecord,dict,remark);
                    });
                  }
                });
              }
              else {
                alert('请进入“我的客服”查看该客服的状态~');
              }
            }
            else {
              var newUserTask = _self.store.createRecord('user-task', {});
              newUserTask.set('status',dicttype);
              newUserTask.set('user',csuser);
              newUserTask.set('task',taskrecord);
              newUserTask.save().then(function() {
                _self.createTaskInvitation(csuser,taskrecord,dict,remark);
              });
            }
          });
        });
      });
    },
  }
});
