import Ember from 'ember';
import InfiniteScroll from './infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  global_curStatus: Ember.inject.service("current-status"),
  infiniteContentPropertyName: "userLogin",
  infiniteModelName: "user",
  infiniteContainerName:"userLoginContainer",

  mailLogin: Ember.computed(function() {
    console.log('loginType',this.get('loginType'));
    if(this.get('loginType')&&(this.get('loginType') == 1)) {
      return true;
    }
    return false;
  }).property('loginType'),
  phoneLogin: Ember.computed(function() {
    console.log('loginType',this.get('loginType'));
    if(!this.get('loginType')||(this.get('loginType') == 2)) {
      return true;
    }
    return false;
  }).property('loginType'),

  loginObs:function(){
    var mobileNum = this.get("mobileNum");
    var password = this.get("password");
    if(mobileNum&&password){
      this.set("deterDisabled",true);
    }else {
      this.set("deterDisabled",false);
    }
  }.observes("mobileNum","password"),
  getJujia(){
    var isJusjia=this.get("global_curStatus.isJujia");
    console.log('jujia is',isJusjia);
    if(isJusjia){
      this.set('jujia',true);
    }else {
      this.set('jujia',false);
    }
  },
  actions:{
    gotoReg: function()  {
      var queryParams;
      var link = "user-reg";
      queryParams = {queryParams:{loginType:this.get('loginType')}};
      this.transitionToRoute(link,queryParams);
    },
    gotoResetPass: function()  {
      var queryParams;
      var link = "reset-pass";
      queryParams = {queryParams:{loginType:this.get('loginType')}};
      this.transitionToRoute(link,queryParams);
    },
    loginAction: function()  {
      $("#userLoginBtn").addClass("tapped");
      setTimeout(function(){$("#userLoginBtn").removeClass("tapped");},200);
      // var mail = this.get('emailAddress');
      var phone = this.get('mobileNum');
      var psd = this.get('password');
      if(!phone){
        this.set('responseInfo','请添写登录账号！');
        return;
      }
      if(!psd){
        this.set('responseInfo','请添写登录密码！');
        return;
      }
      if(this.get('phoneLogin')&&(!(/^1\d{10}$/.test(phone)))) {
        // this.set('success',false);
        // this.set('responseInfo',"手机号格式不正确，请重新输入~");
        // return;
      }
      else if(this.get('mailLogin')&&(!(/^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(mail)))) {
        // this.set('success',false);
        // this.set('responseInfo',"邮箱格式不正确，请重新输入~");
        // return;
      }
      else if(!psd||!(/^.{6,}$/.test(psd))){
        // this.set('success',false);
        // this.set('responseInfo',"密码长度应大于6位，请重新输入~");
        // return;
      }

      var _self = this;
      var passMd5 = $.md5(psd);
      var filter = {};
      filter.password = passMd5;
      if(_self.get('mailLogin')) {
        _self.set('deterDisabled',true);
        filter.loginName = mail;
      }
      else if(_self.get('phoneLogin')) {
        _self.set('deterSDisabled',true);
        filter.loginName = phone;
      }
      console.log("phone1111111111",phone);
      console.log("phone1111111111 filter",filter);
      _self.store.query('userSession',{filter:filter}).then(function(userData) {
        console.log("phone1111111111 userData",userData);
        var user = userData.get('firstObject');
        console.log("phone1111111111 user",user);
        if(user) {
          if(user.get('token')) {
            console.log('login Success');
            console.log('userToken',user.get('token'));
            //登录成功后保存到本地
            var saveLocalAction = function(userLocal){
              //首先把其他用户current置为0
              let users = _self.store.peekAll("localstorage/user");
              users.forEach(function(userInLocal){
                userInLocal.set("current",0);
                userInLocal.save();
              });
              userLocal.set("loginName",filter.loginName);
              userLocal.set("password",passMd5);
              userLocal.set("current",1);
              userLocal.set('token',user.get('token'));
              console.log("need save userlocal",userLocal);
              userLocal.save().then(function(){
                console.log("save local ok");
                _self.set('success',true);
                _self.set('responseInfo','登录成功,页面即将跳转！');
                _self.get("global_curStatus").goHome(_self);
              });
            };
            var userLocalEmpty = _self.store.createRecord("localstorage/user");
            saveLocalAction(userLocalEmpty);
          }
          else {
            if(_self.get('mailLogin')) {
              _self.set('deterDisabled',false);
            }
            else if(_self.get('phoneLogin')) {
              _self.set('deterSDisabled',false);
            }
            _self.set('success',false);
            _self.set('responseInfo','账号或密码不正确！');
          }
        }
        else {
          if(_self.get('mailLogin')) {
            _self.set('deterDisabled',false);
          }
          else if(_self.get('phoneLogin')) {
            _self.set('deterSDisabled',false);
          }
          _self.set('success',false);
          _self.set('responseInfo','账号或密码不正确！');//mobile 第一次会走这里??
        }
      },function(e) {
        console.log("login fail:" ,e);
        if(_self.get('mailLogin')) {
          _self.set('deterDisabled',false);
        }
        else if(_self.get('phoneLogin')) {
          _self.set('deterSDisabled',false);
        }
        alert("登录失败！");
      });
    },
    changeInfo: function() {
      this.set('responseInfo','');
    },
  }
});
