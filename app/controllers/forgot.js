import Ember from 'ember';
export default Ember.Controller.extend({
  hasSendSMS:false,
  pwdFalse:false,
  codeFalse:false,
  pathConfiger: Ember.inject.service("path-configer"),
  actions:{
    changeInfo: function() {
      this.set('responseInfo','');
    },
    getCode(){
      let _self = this;
      $("#get-code").addClass("tapped");
      setTimeout(function(){$("#get-code").removeClass("tapped");},200);
      this.set('pwdFalse',false);
      let mobileNum = this.get('mobileNum');
      let hasUser = true;
      let resetModel = this.store.createRecord('reset-password',{});
      if(!/^1\d{10}$/.test(mobileNum)){
        _self.set('pwdFalse',true);
        _self.set('pwdInfo','请输入正确的手机号');
        return;
      }
      resetModel.set('mobile',mobileNum);
      resetModel.set('type','sendResetCode');
      this.get("global_ajaxCall").set("action","reset-password");
      resetModel.save().then(function(){
        // _self.get("global_ajaxCall").set("action",null);
        _self.set('hasSendSMS',true);
        let wait = 60;
        function time(o) {
          if (wait == 0) {
           o.removeAttribute("disabled");
           $("#get-code").removeClass('input-disabled');
           o.value="免费获取验证码";
           wait = 60;
          } else {
           $("#get-code").addClass('input-disabled');
           o.setAttribute("disabled", true);
           o.value="重新发送(" + wait + "秒)";
           wait--;
           setTimeout(function() {
            time(o)
           },
           1000)
          }
        }
        time($("#get-code")[0]);
      },function(err){
        _self.set('pwdFalse',true);
        let error = err.errors[0];
        if(error.code==='0'){
          _self.set('pwdInfo','用户名格式错误');
        }
        if(error.code==='1'){
          _self.set('pwdInfo','该手机尚未注册');
        }

      })
    },
    toReset(){
      let _self = this;
      this.set('codeFalse',false);
      $("#reset-password").addClass("tapped");
      setTimeout(function(){$("#reset-password").removeClass("tapped");},200);
      let codeSame = false;
      //验证短信码是否正确，正确的跳转重置密码页面
      let resetModel = this.store.createRecord('reset-password',{});
      let code = this.get('code');
      let mobileNum = this.get('mobileNum');
      resetModel.set('mobile',mobileNum);
      resetModel.set('code',code);
      resetModel.set('type','checkCode');
      this.get("global_ajaxCall").set("action","reset-password");
      resetModel.save().then(function(){
        _self.get("global_ajaxCall").set("action",null);
        _self.transitionToRoute('reset-password',{queryParams: { mobile: mobileNum }});
      },function(err){
        _self.set('codeFalse',true);
        let error = err.errors[0];
        if(error.code=='2'){
          _self.set('codeInfo','验证码错误');
        }
      });

    },
  }
});
