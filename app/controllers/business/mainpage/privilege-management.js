import Ember from 'ember';
const {
    taskApplyStatus_applyFail,
    taskApplyStatus_refuseInvitation,
    taskApplyStatus_invited,
    taskInviteStatus_inviteFail,
    taskInviteStatus_invite
} = Constants;

export default Ember.Controller.extend({
    mainController: Ember.inject.controller('business.mainpage'),
    showDetail: true,
    createTaskInvitation: function(csuser, task, status, remark) {
        var newInvitation = this.store.createRecord('task-invitation', {});
        newInvitation.set('customerService', csuser);
        newInvitation.set('task', task);
        newInvitation.set('status', status);
        newInvitation.set('remark', remark);
        newInvitation.save().then(function(inviteData) {
            csuser.set("isInvite", true);
            csuser.set("inviteStatus", inviteData.get('status').get('typename'));
        });
    },
    actions: {
        /*详情*/
        enterDetail: function(privilege) {
            var id = privilege.get("id");
            this.get("mainController").switchMainPage('privilege-detail', {
                id: id
            });
        },
        /*删除*/
        delPrivilege: function(privilege) {
            privilege.set("delStatus", 1);
            var _self = this;
            privilege.save().then(function() {
                _self.get('target').send('saveRefresh');
            });
        },
        /*增添*/
        addPrivilege: function() {
            this.get("mainController").switchMainPage('privilege-add');
        },
      systemTypeChange:function(value){
            this.set("systemType",value);
            App.lookup("route:business.mainpage.privilege-management").doQuery();
        }
    }
});
