import Ember from 'ember';
import Reg from './user-login';
import InfiniteScroll from './infinite-scroll';

export default Reg.extend(InfiniteScroll,{
  infiniteContentPropertyName: "userReg",
  infiniteModelName: "user",
  infiniteContainerName:"userRegContainer",

  sendMCodeEvent(type) {
    var _self=this;
    var val = this.get("emailAddress");
    if(!(/^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(val))) {
      this.set('success',false);
      this.set('responseMMess',"邮箱格式不正确，请重新输入~");
      return;
    }
    this.store.query('user',{filter:{loginName:val}}).then(function(users) {
      var user = users.get('firstObject');
      if(type === 'reg'&&user&&user.get('id')) {
        _self.set('success',false);
        _self.set('responseMMess',"该用户已注册!");
        return;
      }
      if(type === 'reset'&&(!user||!user.get('id'))) {
        _self.set('success',false);
        _self.set('responseMMess',"该用户不存在!");
        return;
      }
      _self.set('second',60);
      _self.set("sendDisabled",true);
      var filter = {};
      filter.mail = _self.get('emailAddress');
      filter.type = type;
      _self.store.query('authCode',{filter:filter}).then(function() {
        _self.set('success',true);
        _self.set('responseMMess',"邮件发送成功~");
        function time() {
          if(_self.get('second')===0)
          {
            _self.set("isSend",false);
            _self.set("sendDisabled",false);
            _self.set('responseMMess',"");
          }
          else
          {
            _self.set("isSend",true);
            _self.set('second',_self.get('second')-1);
            setTimeout(function() {
              time();
            },1000);
          }
        }
        time();
      },function() {
        _self.set("isSend",false);
        _self.set("sendDisabled",false);
          _self.set('success',false);
        _self.set('responseMMess',"邮件发送失败~");
      });
    });
  },
  sendSCodeEvent(type) {
    var _self=this;
    var val = this.get("mobileNum");
    if(!(/^1\d{10}$/.test(val))) {
      _self.set('success',false);
      this.set('responseMess',"手机号格式不正确，请重新输入~");
      return;
    }
    this.store.query('user',{filter:{loginName:val}}).then(function(users) {
      var user = users.get('firstObject');
      if(type === 'reg'&&user&&user.get('id')) {
        _self.set('success',false);
        _self.set('responseMess',"该用户已注册!");
        return;
      }
      if(type === 'reset'&&(!user||!user.get('id'))) {
        _self.set('success',false);
        _self.set('responseMess',"该用户不存在!");
        return;
      }
      _self.set('secondS',60);
      _self.set("sendSDisabled",true);
      var filter = {};
      filter.mobile = _self.get('mobileNum');
      filter.type = type;
      _self.store.query('authCode',{filter:filter}).then(function() {
        _self.set('success',true);
        _self.set('responseMess',"验证码发送成功~");
        function time() {
          if(_self.get('secondS')===0)
          {
            _self.set('isSSend',false);
            _self.set("sendSDisabled",false);
            _self.set('responseMess',"");
          }
          else
          {
            _self.set('isSSend',true);
            _self.set('secondS',_self.get('secondS')-1);
            setTimeout(function() {
              time();
            },1000);
          }
        }
        time();
      },function() {
        _self.set('isSSend',false);
          _self.set('success',false);
        _self.set('responseMess',"验证码发送失败~");
        _self.set("sendSDisabled",false);
      });
    });
  },
  saveLocalAction: function(userLocal,loginName,password){
    var _self = this;
    userLocal.set("loginName",loginName);
    userLocal.set("password",password);
    userLocal.set("current",1);
    userLocal.save().then(function(){
      console.log("save local ok");
        _self.set('success',true);
      _self.set('responseInfo','登录成功,页面即将跳转！');
      _self.get("global_curStatus").goHome(_self);
    });
  },
  submitInfoEvent(type) {
    var _self = this;
    var mail = this.get('emailAddress');
    var phone = this.get('mobileNum');
    var mcode = this.get('mcode');
    if(this.get('phoneLogin')&&(!(/^1\d{10}$/.test(phone)))) {
      this.set('success',false);
      this.set('responseInfo',"手机号格式不正确，请重新输入~");
      return;
    }
    else if(this.get('mailLogin')&&(!(/^\w+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(mail)))) {
      this.set('success',false);
      this.set('responseInfo',"邮箱格式不正确，请重新输入~");
      return;
    }
    else if(!mcode) {
      this.set('success',false);
      this.set('responseInfo',"请输入验证码~");
      return;
    }
    else if(!this.get('password')||!(/^.{6,}$/.test(this.get('password')))){
      this.set('success',false);
      this.set('responseInfo',"密码长度应大于6位，请重新输入~");
      return;
    }
    var psd = $.md5(this.get('password'));
    var newUser = _self.store.createRecord('userSession',{});
    if(this.get('mailLogin')) {
      _self.set('deterDisabled',true);
      newUser.set('email',mail);
      newUser.set('regWay',2);
    }
    if(this.get('phoneLogin')) {
      _self.set('deterSDisabled',true);
      newUser.set('phone',phone);
      newUser.set('regWay',1);
    }
    newUser.set('authCode',mcode);
    if(type === 'reg') {
      newUser.set('password',psd);
      if(_self.get('inviter')) {
        newUser.set('inviter',_self.get('inviter'));
      }
      _self.get("global_ajaxCall").set("action","reg");
    }
    if(type === 'reset') {
      newUser.set('newPassword',psd);
      _self.get("global_ajaxCall").set("action","resetPassword");
    }

    newUser.save().then(function(userData) {
      if(userData.get('errcode')===0) {
        if(_self.get('mailLogin')) {
          _self.set('deterDisabled',false);
        }
        else if(_self.get('phoneLogin')) {
          _self.set('deterSDisabled',false);
        }
          _self.set('success',false);
        _self.set('responseInfo','验证码输入错误！');
      }
      else if(userData.get('errcode')===1) {
        if(_self.get('mailLogin')) {
          _self.set('deterDisabled',false);
        }
        else if(_self.get('phoneLogin')) {
          _self.set('deterSDisabled',false);
        }
        if(type === 'reg') {
          _self.set('success',false);
          _self.set('responseInfo','该账号已存在！');
        }
        if(type === 'reset') {
          _self.set('success',false);
          _self.set('responseInfo','账号不存在！');
        }
      }
      else {
        if(type === 'reg') {
          _self.set('success',true);
          _self.set('responseInfo','注册成功~');
        }
        if(type === 'reset') {
          _self.set('success',true);
          _self.set('responseInfo','重置成功~');
        }
        var filter = {};
        if(_self.get('mailLogin')) {
          filter.loginName = mail;
        }
        else if(_self.get('phoneLogin')) {
          filter.loginName = phone;
        }
        filter.password = psd;
        _self.store.query('userSession',{filter:filter}).then(function(users) {
          var user = users.get('firstObject');
          if(user&&user.get('token')) {
            if(type === 'reg') {
              //注册登录成功后保存到本地
              var userLocalEmpty = _self.store.createRecord("localstorage/user");
              _self.saveLocalAction(userLocalEmpty,filter.loginName,psd);
            }
            if(type === 'reset') {
              _self.store.query('localstorage/user',{filter:{loginName:filter.loginName}}).then(function(users) {
                var user = users.get('firstObject');
                if(user&&user.get('id')) {
                  _self.saveLocalAction(user,filter.loginName,psd);
                }
                else {
                  var userLocalEmpty = _self.store.createRecord("localstorage/user");
                  _self.saveLocalAction(userLocalEmpty,filter.loginName,psd);
                }
              });
            }
          }
          else {
            _self.set('success',false);
            _self.set('responseInfo','登录失败！请返回登录页面进行登录~');
          }
        });
      }
    },function() {
      if(_self.get('mailLogin')) {
        _self.set('deterDisabled',false);
      }
      else if(_self.get('phoneLogin')) {
        _self.set('deterSDisabled',false);
      }
      if(type === 'reset') {
        alert('密码重置失败！');
      }
      else {
        alert('注册失败！');
      }
    });
  },

  actions:{
    gotoLogin: function()  {
      var queryParams;
      var link = "user-login";
      if(this.get('phoneLogin')) {
      this.set('loginType',2);
        queryParams = {queryParams:{loginType:2}};
      }
      else if(this.get('mailLogin')) {
      this.set('loginType',1);
        queryParams = {queryParams:{loginType:1}};
      }
      this.transitionToRoute(link,queryParams);
    },
    gotoRegTerms: function()  {
      this.transitionToRoute('reg-terms');
    },
    sendMCode() {
      this.sendMCodeEvent('reg');
    },
    sendSCode() {
      this.sendSCodeEvent('reg');
    },
    validateMCode: function() {
      this.submitInfoEvent('reg');
    },
    changeInfo: function() {
      this.set('responseInfo','');
    },
  }
});
