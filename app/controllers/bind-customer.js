import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service("date-service"),
  infiniteContentPropertyName: "bindCustomerList",
  infiniteModelName: "userSession",
  infiniteContainerName:"bindCustomerContainer",

  constants: Constants,
  queryCondition: '',
  mainController: Ember.inject.controller('business.mainpage'),

  mobileAlertMess: function(text) {
    var _self = this;
    this.set('responseInfo',text);
    this.set('theTextOfModel',true);
    setTimeout(()=>{
      _self.set("theTextOfModel", false);
    },2000);
  },

  actions: {
    //跳转至编辑服务页
    bindCustomer: function() {
      var $FromDate = $("#FromDate");
      var date = $FromDate.val();
      // var date = this.get("date");
      console.log("11111111111date",date);
      $("#bind-customer-btn").addClass("tapped");
      setTimeout(function(){$("#bind-customer-btn").removeClass("tapped");},300);
      var name = this.get('oldName');
      // var birth = this.get('oldBirth');
      var birth = new Date(date).getTime()/1000;
      console.log("11111111111date",birth);
      console.log("customer11111  oldBirthday",birth);
      if(!name){
        this.mobileAlertMess('老人名字不能为空');
        return;
      }else if(!birth){
        this.mobileAlertMess('老人生日不能为空');
        return;
      }
      var _self = this;
      var filter = {};
      filter.name = name;
      filter.birth = birth;
      filter.bind = true;
      // console.log("code in con:",_self.get("code"));
      // filter.code = _self.get("code");
      _self.store.query('userSession', {
        filter: filter
      }).then(function(userData) {
        var user = userData.get('firstObject');
        console.log("user111111111",user);
        if (user) {
          if (user.get('token')) {
            console.log('login Success',user);
            console.log('userToken', user.get('token'));
            //登录成功后保存到本地
            var saveLocalAction = function(userLocal,userBack) {
              //首先把其他用户current置为0
              let users = _self.store.peekAll("localstorage/user");
              users.forEach(function(userInLocal){
                userInLocal.set("current",0);
                userInLocal.save();
              });
              console.log("userBack loginName:" + userBack.get("loginName"));
              userLocal.set("loginName", userBack.get("loginName"));
              userLocal.set("password", userBack.get("password"));
              userLocal.set("current", 1);
              console.log("need save userlocal", userLocal);
              console.log("userlocal loginName:",userLocal.get("loginName"));
              userLocal.save().then(function(userData) {
                console.log("save local ok userLocalEmpty",userData);
                console.log("userlocal  save loginName:" + userData.get("loginName"));
                _self.set('success', true);
                _self.mobileAlertMess('绑定成功,页面即将跳转！');
                _self.get("global_curStatus").goHome(_self);
              });
            };
            var userLocalEmpty = _self.store.createRecord("localstorage/user");
            console.log("userLocalEmpty",userLocalEmpty);
            saveLocalAction(userLocalEmpty,user);
          } else {
            _self.set('success', false);
            _self.mobileAlertMess('无此老人信息,绑定失败！');
          }
        } else {
          if (_self.get('mailLogin')) {
            _self.set('deterDisabled', false);
          } else if (_self.get('phoneLogin')) {
            _self.set('deterSDisabled', false);
          }
          _self.set('success', false);
          _self.mobileAlertMess('账号或密码不正确！');
        }
      }, function(e) {
        console.log("login fail:", e);
        if (_self.get('mailLogin')) {
          _self.set('deterDisabled', false);
        } else if (_self.get('phoneLogin')) {
          _self.set('deterSDisabled', false);
        }
        _self.mobileAlertMess("绑定失败！");
      });
    },
  }
});
