import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  actions:{
    //删除按钮
    delById : function() {
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此检查记录",function(){
        _self.send('cancelPassSubmit',_self.get('serviceCheckInfo'));
      });
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //弹窗确定，删除记录
    cancelPassSubmit(serviceCheck){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      serviceCheck.set("delStatus", 1);
      serviceCheck.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('service-check-management');
      });
		},
  }
});
