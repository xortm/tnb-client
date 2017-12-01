import Ember from 'ember';
export default Ember.Controller.extend({
  actions:{
    changeInfo: function() {
      this.set('responseInfo','');
    },
    resetPassword(){
      let _self = this;
      $("#reset-password").addClass("tapped");
      setTimeout(function(){$("#reset-password").removeClass("tapped");},200);
      let resetModel = this.store.createRecord('reset-password',{});
      let mobileNum = this.get('mobile');
      let password = this.get('password');
      if(!password){//没有输入新密码
        this.set('pwdFalse',true);
        this.set('pwdInfo','请输入密码');
        return ;
      }
      resetModel.set('mobile',mobileNum);
      resetModel.set('password',$.md5(password));
      resetModel.set('type','resetPassword');
      this.get("global_ajaxCall").set("action","reset-password");
      resetModel.save().then(function(){
        _self.get("global_ajaxCall").set("action",null);
        _self.transitionToRoute('user-login');
      },function(err){

      })
    },
  }
});
