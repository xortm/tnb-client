import Ember from 'ember';
import InfoItem from '../ui/info-item';
const { authenticate_forbidden,authenticate_not,authenticate_yes,authenticate_succ,authenticate_fail} = Constants;


export default InfoItem.extend({
	actions:{
		popInvitePass: function (curUser) {
			var task = this.get('curTask');
			console.log('curUser status',curUser.get('status'));
			if(curUser.get('status') === authenticate_forbidden) {
				this.set('alertModal',true);
				this.set('alertInfo','您的账号已被冻结，不能进行相关操作！');
			}
			else if (curUser.get('status') === authenticate_not||curUser.get('status') === authenticate_fail) {
				this.set("confirmIdModal",true);
			}
			else if (curUser.get('status') === authenticate_yes) {
				this.set('alertModal',true);
				this.set('alertInfo','您的认证申请正在审核中，请耐心等待~');
			}
			else if (curUser.get('status') === authenticate_succ) {
				if(!task||!task.get('id')) {
					this.set('alertModal',true);
					this.set('alertInfo','请发布一个任务，或者选择一个审核成功的任务');
				}
				else {
					if(task.get('extendIfo').get('csNeed') === task.get('extendIfo').get('csHave')) {
						this.set('alertModal',true);
						this.set('alertInfo','该任务的已招客服人数已经到达需求上限，如要增加人数，请联系运营人员4000-911-777');
					}
					else {
						this.set("showpopInvitePassModal",true);
					}

				}
			}
			else {
				this.set("confirmIdModal",true);
			}
		},
		closeAlert: function(){
			this.set("alertModal",false);
		},
		closeConfirm: function(){
			this.set("confirmIdModal",false);
		},
		switchStatus: function(){
			this.set("confirmIdModal",false);
			var mainpageController = App.lookup('controller:business.mainpage');
			mainpageController.switchMainPage('business-info');
		},
		cancelPassSubmit: function(){
			this.set("showpopInvitePassModal",false);
		},
		changePassSubmit: function(){
			this.set("showpopInvitePassModal",false);
		},
		agreeApply: function (csuser) {
			this.sendAction('agreeApply',csuser);
		},
		refuseApply: function (csuser) {
			this.sendAction('refuseApply',csuser);
		},
		enterDetail: function (csuser) {
			this.sendAction('enterDetail',csuser);
		},
		invitation: function (csuser) {
			var remark = this.get('remark');
			this.set("showpopInvitePassModal",false);
			this.sendAction('invitation',csuser,remark);
		},
	}

});
