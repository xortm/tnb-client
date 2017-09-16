import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  infiniteContentPropertyName: "changePasswordList",
  infiniteModelName: "user",
  infiniteContainerName:"changePasswordContainer",
  stopScroll:true,

  service_PageConstrut:Ember.inject.service("page-constructure"),
  mainController: Ember.inject.controller('business.mainpage'),
  actions:{
    changePassword: function(){
      $("#changePassword").addClass("tapped");
      setTimeout(function(){$("#changePassword").removeClass("tapped");},200);
      var curUser = this.get("global_curStatus").getUser();
      var _self = this;
      var password = curUser.get("password");
      var psd = this.get('password');
      console.log("1111111  jinru111",password);
      var newPsd = this.get('newPass');
      var confirmPsd = this.get('confirmPass');
      if(!psd) {
        this.set("responseInfo","请输入旧密码！");
      }
      else if (!newPsd) {
        this.set("responseInfo","请输入新密码！");
      }
      else if (!confirmPsd) {
        this.set("responseInfo","请输入确认密码！");
      }
      else {
        if(!newPsd.match(/^.{6,}$/)) {
          this.set("responseInfo","新密码格式不正确,请输入6位以上字符！");
        }
        else if(newPsd!==confirmPsd) {
          this.set("responseInfo","确认密码与新密码不一致！");
        }
        else if($.md5(psd)!==password) {
          this.set("responseInfo","旧密码输入错误！");
        }
        else if($.md5(newPsd)===password) {
          this.set("responseInfo","新密码不能与旧密码相同！");
        }
        else {
          _self.store.findRecord("user",curUser.get("id")).then(function(user){
            user.set('passcode',$.md5(newPsd));
            console.log("password11111",$.md5(newPsd));
            user.save().then(function(userData) {
              // if(userData.get('errcode')===0) {
              //   _self.set('responseInfo','旧密码输入错误！');
              // }
              // else {
              // }
                _self.store.query('localstorage/user',curUser.get('loginName')).then(function(users) {
                  var user = users.get('firstObject');
                  user.set('password',$.md5(newPsd));
                  user.save().then(function() {
                    _self.set('password','');
                    _self.set('newPass','');
                    _self.set('confirmPass','');
                    _self.set("responseInfo","");
                  });
                });
                _self.set("responseInfo","密码修改成功！");
                setTimeout(function(){
                   _self.get("mainController").send('quit');//退出
                },1000)
            });
          },function() {
            _self.set("responseInfo","密码修改失败！");
          });


        }
      }

    },
  },

});
