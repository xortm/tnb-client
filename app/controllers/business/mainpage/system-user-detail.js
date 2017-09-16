import Ember from 'ember';
import Changeset from 'ember-changeset';
import userValidations from '../../../validations/user';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  pathConfiger: Ember.inject.service("path-configer"),
  constants: Constants,

  userModel: Ember.computed("user", function() {
      var model = this.get("user");
      console.log('userModelMMM   ' + model);
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(userValidations), userValidations);
  }),
  uploadUrl: Ember.computed('property', function() {
      return this.get("pathConfiger").get("uploadUrl");
  }),
  // sysPassWord:Ember.computed('user',function(){
  //   if(user.get("password")){
  //     return user.get("password");
  //   }
  // }),
  actions:{
    invalid:function(){},
    editModelModify: function() {
      this.set('editModel', true);
    },
    cancelEdit:function(){
      var editMode = this.get("editMode");
      if(editMode=='edit'){
        this.set('editModel',false);
      }else{
        App.lookup('controller:business.mainpage').switchMainPage('system-user');
      }
    },
    //删除按钮
    delById: function(user) {
        //  this.set('showpopInvitePassModal',true);
        var _self = this;
        _self.get("mainController").showConfirm("是否确定删除此员工信息", function() {
            _self.send('delUser',_self.get('user'));
        });
    },
    delUser:function(user){
      var _self = this;
      user.set("delStatus", 1);
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
      user.save().then(function() {
          _self.get("mainController").showPopTip("删除成功");
          _self.get("mainController").switchMainPage('staff-management');
      });
    },
    saveClick:function(){
      var _self = this;
      var sysPassWord = this.get("sysPassWord");//以前的密码md5加密
      console.log("sysPassWord11",sysPassWord);
      // if(!sysPassWord){alert("密码不能为空"); return;}
      var userModel = this.get("userModel");
      var passcode = userModel.get("passcode");
      console.log("sysPassWord11 passcode before",passcode);
      if(passcode==sysPassWord){//相等 证明没有变动
        userModel.set("passcode",passcode);
      }else {
        userModel.set("passcode",$.md5(passcode));
      }
      console.log("sysPassWord11 passcode",passcode);
      userModel.validate().then(function() {
        if (userModel.get('errors.length') === 0) {
          if (_self.get('editMode') == 'add') {
            var newLoginName = userModel.get("loginName");
            _self.store.query("user",{filter:{loginName:newLoginName}}).then(function (users) {
              var user = users.get("firstObject");
              if(user){
                App.lookup('controller:business.mainpage').showPopTip("该账号已有");
                // alert("此登录账号已有，请填写新账号");
              }else{
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                userModel.save().then(function() {
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  _self.get("mainController").switchMainPage('system-user');
                });
              }
            });
          }else{
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            userModel.save().then(function() {
              App.lookup('controller:business.mainpage').showPopTip("保存成功");
              _self.set('editModel',false);
            });
          }
      } else {
          userModel.set("validFlag", Math.random());
      }

      });
      // userModel.validate().then(function() {
      //     if (userModel.get('errors.length') === 0) {
      //         App.lookup('controller:business.mainpage').openPopTip("正在保存");
      //         userModel.save().then(function() {
      //           App.lookup('controller:business.mainpage').showPopTip("保存成功");
      //           if (_self.get('editMode') == 'add') {
      //               _self.get("mainController").switchMainPage('system-user');
      //           }else{
      //             _self.set('editModel',false);
      //           }
      //         });
      //     } else {
      //         userModel.set("validFlag", Math.random());
      //     }
      // });
    },

    roleSelect: function(role) {
        this.set("user.role", role);
        this.set('userModel.role', role);
    },
    employeeSelect: function(employee) {
        this.set("user.employee", employee);
        this.set('userModel.employee', employee);
        this.set('userModel.avatar', employee.get("avatar"));
        this.set('userModel.avatarUrl', employee.get("avatarUrl"));//头像
        this.set('userModel.name', employee.get("name"));//名字
        this.set('userModel.staffSex', employee.get("staffSex"));//性别
        this.set('userModel.age', employee.get("age"));//年龄
        this.set('userModel.staffCardCode', employee.get("staffCardCode"));//身份证
        this.set('userModel.staffTel', employee.get("staffTel"));//电话号码
        this.set('userModel.staffMail', employee.get("staffMail"));//邮箱
        this.set('userModel.curAddress', employee.get("curAddress"));//家庭住址
        this.set('userModel.staffCensus', employee.get("staffCensus"));//籍贯
        this.set('userModel.staffNation', employee.get("staffNation"));//民族
        console.log("employee1111",employee);
    },
    employeeStatusSelect:function(dic){
      this.set("user.staffStatus", dic);
      this.set('userModel.staffStatus', dic);
    },
  },
});
