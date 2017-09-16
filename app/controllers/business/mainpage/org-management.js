import Ember from 'ember';
import Changeset from 'ember-changeset';
import OrgValidations from '../../../validations/organization';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(OrgValidations, {
    pathConfiger: Ember.inject.service("path-configer"),
    orgModel: Ember.computed("org", function() {
        var model = this.get("org");
        console.log("org  in compute" + model);
        if (!model) {
            return null;
        }
        this.get('adminInfo').set("loginName", model.get("loginName"));
        return new Changeset(model, lookupValidator(OrgValidations), OrgValidations);
    }),
    adminInfo: Ember.Object.create({
        page_errors: Ember.Object.create({}),
    }),
    mainController: Ember.inject.controller('business.mainpage'),
    parent: null,
    editModel: null,
    constants: Constants,
    uploadUrl: Ember.computed('property', function() {
        return this.get("pathConfiger").get("uploadUrl");
    }),
    deformation: function() {
        if ($(".cccc >div img").width() >= $(".cccc >div img").height()) {
            $(".cccc >div ").addClass("intergration_normal");
            $(".cccc >div img").css("height", "110px  ");
            $(".cccc >div img").css("width", "auto");
            console.log("this.widthcccccccccccccc==========", $(".cccc >div img").width());
            console.log('==========cccccccccccccccintergration_normal_height', $(".cccc >div img").height(), $(".cccc >div img").width());
        } else {
            $(".cccc >div ").addClass("intergration_normal");
            $(".cccc >div img").css("width", "110px ");
            $(".cccc >div img").css("height", "auto");
            console.log("this.heightccccc==========", $(".cccc >div img").height());
            console.log('==========cccccccccccccccintergration_normal', $(".cccc >div img").height(), $(".cccc >div img").width());
        }
    },
    loginNameAuthCodeValidate() {
        //var loginName = this.get('orgModel.admin.loginName');
        var loginName = this.get('adminInfo.loginName');
        if (!loginName || loginName.length === 0) {
            this.set('adminInfo.page_errors.loginName', '登录名不能为空');
            this.get('adminInfo').incrementProperty("page_errorsCnt");
            return false;
        } else {
            var reg = /(^1(3|4|5|7|8)\d{9}$)/;
            if (!reg.test(loginName)) {
                this.set('adminInfo.page_errors.loginName', '请输入正确的手机号');
                this.get('adminInfo').incrementProperty("page_errorsCnt");
                return false;
            } else {
                this.set("adminInfo.page_errors.loginName", null);
            }
        }
        //var authCode = this.get('orgModel.admin.authCode');
        var authCode = this.get('adminInfo.authCode');
        if (!authCode || authCode.length === 0) {
            this.set('adminInfo.page_errors.authCode', '验证码不能为空');
            this.get('adminInfo').incrementProperty("page_errorsCnt");
            return false;
        } else {
            this.set("adminInfo.page_errors.authCode", null);
        }
        return true;
    },
    mobileAlertMess: function(text) {
      var _self = this;
      this.set('theText',text);
      this.set('theTextModel',true);
      // setTimeout(()=>{
      //   _self.set("theTextModel", false);
      // },2000);
    },

    actions: {
        invalid() {
            //alert("error");
        },
        saveAdminClick: function() {
            var _self = this;
            var orgModel = this.get("orgModel");
            var loginName = this.get('newLoginName');
            var authCode = this.get('newAuthCode');
            if(!authCode){
              this.set("newMessage","请填写验证码");
              this.set("showNewMessage",true);
              Ember.run.later(function(){
                _self.set("showNewMessage",false);
              },2000);
              return;
            }
            console.log("loginName and authCode",loginName,authCode);
            this.store.findRecord('user', orgModel.get('admin').get('id')).then(function(adminUser) {
                adminUser.set('loginName',loginName);
                adminUser.set('authCode',authCode);
                _self.get('global_ajaxCall').set("action", 'editLoginName');
                adminUser.save().then(function(adminUser) {
                  console.log("init111 save");
                    if (adminUser.get('errcode') === 0) {
                      _self.set("newMessage","验证码错误");
                      _self.set("showNewMessage",true);
                      Ember.run.later(function(){
                        _self.set("showNewMessage",false);
                      },2000);
                    } else {
                        _self.set("newLoginName","");
                        _self.set("newAuthCode","");
                        _self.set("theText","");
                        _self.set("changeLoginNameModel",false);
                        _self.set("showNewLoginName",false);
                        _self.set("theTextModel",false);
                        App.lookup('controller:business.mainpage').showPopTip("管理员账户修改成功");
                    }
                });
            });
        },
        saveClick: function() {
            var _self = this;
            var orgModel = this.get("orgModel");
            orgModel.validate().then(function() {
                if (orgModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存机构信息");
                    orgModel.save().then(function() {
                        _self.set('editModel', null);
                        App.lookup('controller:business.mainpage').showPopTip("机构信息保存成功");
                    });
                } else {
                    orgModel.set("validFlag", Math.random());
                    console.log("error----- " + orgModel.get('errors'));
                }
            });

            // if ((loginName1&&loginName1.length !== 0) ||( authCode1&&authCode1.length !== 0)) {
            //     //this.saveAdminClick();
            //     if (_self.loginNameAuthCodeValidate()) {
            //       var t=orgModel.get('admin').get('id');
            //         this.store.findRecord('user', orgModel.get('admin').get('id')).then(function(adminUser) {
            //             /*adminUser.set('loginName', orgModel.get('admin').get('loginName'));
            //             adminUser.set('authCode', orgModel.get('admin').get('authCode'));*/
            //             adminUser.set('loginName', _self.get('adminInfo.loginName'));
            //             adminUser.set('authCode', _self.get('adminInfo.authCode'));
            //             App.lookup('controller:business.mainpage').openPopTip("正在保存账户信息");
            //             _self.get('global_ajaxCall').set("action", 'editLoginName');
            //             adminUser.save().then(function(adminUser) {
            //                 if (adminUser.get('errcode') === 0) {
            //                     _self.set('adminInfo.page_errors.authCode', '验证码错误');
            //                     _self.get('adminInfo').incrementProperty("page_errorsCnt");
            //                     App.lookup('controller:business.mainpage').showPopTip("验证码错误");
            //                     return false;
            //                 } else {
            //                     _self.set('editLoginNameModel', null);
            //                     App.lookup('controller:business.mainpage').showPopTip("账户信息保存成功");
            //                     //---------------
            //                     orgModel.validate().then(function() {
            //                         if (orgModel.get('errors.length') === 0) {
            //                             App.lookup('controller:business.mainpage').openPopTip("正在保存机构信息");
            //                             orgModel.save().then(function() {
            //                                 _self.set('editModel', null);
            //                                 App.lookup('controller:business.mainpage').showPopTip("机构信息保存成功");
            //                             });
            //                         } else {
            //                             orgModel.set("validFlag", Math.random());
            //                             console.log("error----- " + orgModel.get('errors'));
            //                         }
            //                     });
            //                     //----------------
            //                 }
            //             });
            //         });
            //     }
            //     //---------------
            // }
        },

        // editOrg: function() {
        //     var _self = this;
        //     console.log("id   " + _self.get('id'));
        //     this.store.findRecord('organization', _self.get('id')).then(function(org) {
        //         org.set('orgName', _self.get("orgDetail.orgName"));
        //         org.set('orgCode', _self.get("orgDetail.orgCode"));
        //         org.set('mobileIcon', _self.get("orgDetail.mobileIcon"));
        //         console.log("id   " + org.get('id') + org.get('orgName') + org.get('orgCode') + org.get('mobileIcon'));
        //         org.set('delStatus', 0);
        //         org.save().then(function() {
        //             _self.get("mainController").switchMainPage('org-management', {
        //                 flag: 'edit'
        //             });
        //         });
        //     });
        // },
        // addOrg: function() {
        //     var _self = this;
        //     var org = _self.store.createRecord('organization', {});
        //     org.set('orgName', _self.get("orgName"));
        //     org.set('orgCode', _self.get("orgCode"));
        //     org.set('orgTel', _self.get("orgTel"));
        //     org.set('address', _self.get("address"));
        //     org.set('mobileIcon', _self.get("mobileIcon"));
        //     org.set('delStatus', 0);
        //     org.save().then(function() {
        //         _self.get("mainController").switchMainPage('org-management', {
        //             flag: 'add'
        //         });
        //     });
        //
        // },
        // cancelOperate: function() {
        //     console.log("cancelEdit");
        //     if (this.get('operateFlag') == 'edit') {
        //         this.get("org").rollbackAttributes();
        //         this.set("orgModel", new Changeset(this.get("org"), lookupValidator(OrgValidations), OrgValidations));
        //     }
        //     this.get("mainController").switchMainPage('org-management', {
        //         flag: 'edit-add'
        //     });
        // },
        // /*删除*/
        // delOrg: function() {
        //     var _self = this;
        //     this.store.findRecord('organization', _self.get('id')).then(function(org) {
        //         org.set("delStatus", 1);
        //         org.save().then(function() {
        //             _self.get("mainController").switchMainPage('org-management', {});
        //         });
        //     });
        // },

        editModelModify: function() {
            this.set('editModel', 1);
        },
        editAdminModelModify: function() {
            this.set('editLoginNameModel', 1);
        },
        cancelEdit: function() {
            this.set('editModel', null);
            this.get("org").rollbackAttributes();
            this.set("orgModel", new Changeset(this.get("org"), lookupValidator(OrgValidations), OrgValidations));
        },
        cancelAdminEdit: function() {
            this.set('editLoginNameModel', null);
        },
        orgTypeSelect: function(dict) {
            this.set("org.type", dict);
            this.set('orgModel.type', dict);
        },
        uploadSucc: function(response) {
            this.deformation();
            var model = this.get('model');
            var res = JSON.parse(response);
            console.log("++++res+++++", res);
            this.get("org").set("licenseImg", res.relativePath);
            console.log("res.relativePath:", res.relativePath);
            this.get("org").save();
            //this.set('color',false);
            //this.set("errorText","");
        },
        editAdminLoginName: function(loginType) {
            var _self = this;
            var adminUser = this.get("orgModel").get('admin');
            var filter = {};
            if(loginType=="newLoginName"){
              filter.mobile = this.get("newLoginName");
              console.log("mobile111 newLoginName",this.get("newLoginName"));
            }else {
              filter.mobile = adminUser.get('loginName');
              console.log("mobile111",adminUser,adminUser.get('loginName'));
            }
            filter.type = "reset";
            console.log("mobile111",filter);
            _self.set('secondS',60);
            _self.store.query('authCode', {
                filter: filter
            }).then(function() {
              _self.mobileAlertMess("验证码发送成功！");
              function time() {
              if(_self.get('secondS')===0){
                _self.set('isSSend',false);
              }else{
                  _self.set('isSSend',true);
                  _self.set('secondS',_self.get('secondS')-1);
                  setTimeout(function() {
                    time();
                  },1000);
                }
              }
              time();
            },
            function() {
            _self.set('isSSend',false);
            _self.mobileAlertMess("验证码发送失败！");
          }
        );
      },

      checkOldPhone(){
        this.set("checkOldPhoneModel",true);
      },
      saveLoginName(){
        var _self = this;
        var loginName = this.get('newLoginName');
        var reg = /(^1(3|4|5|7|8)\d{9}$)/;
        if (!loginName || loginName.length === 0) {
          this.set("newLoginNameMessage",true);
          this.set('newLoginNameMessage','登录账号不能为空');
          Ember.run.later(function(){
            _self.set("newLoginNameMessage",false);
          },2000);
        } else if(!reg.test(loginName)){
          this.set("newLoginNameMessage",true);
          this.set('newLoginNameMessage','请输入正确的手机号');
          Ember.run.later(function(){
            _self.set("newLoginNameMessage",false);
          },2000);
        }else {
          this.set("changeLoginNameModel",true);
        }
      },
      cancelPassSubmit(){
        this.set("checkOldPhoneModel",false);
        this.set("changeLoginNameModel",false);
        this.set("theText","");
        this.set("theTextModel",false);
        this.set('secondS',0);
        this.set('isSSend',false);
      },
      cancelLogin(){
        this.set("showNewLoginName",false);
      },
      changeLoginName(){
        var _self = this;
        var orgModel = this.get('orgModel');
        var loginName = orgModel.get('admin.loginName');
        var oldAuthCode = this.get("oldAuthCode");
        if(!oldAuthCode){
          this.set("oldMessage","请填写验证码");
          this.set("showOldMessage",true);
          Ember.run.later(function(){
            _self.set("showOldMessage",false);
          },2000);
          return;
        }
        this.store.findRecord('user', orgModel.get('admin').get('id')).then(function(adminUser) {
            adminUser.set('loginName',loginName);
            adminUser.set('authCode',oldAuthCode);
            _self.get('global_ajaxCall').set("action", 'checkAuthCode');
            adminUser.save().then(function(adminUser) {
                if (adminUser.get('errcode') === 0) {
                  _self.set("oldMessage","验证码错误");
                  _self.set("showOldMessage",true);
                  Ember.run.later(function(){
                    _self.set("showOldMessage",false);
                  },2000);
                } else {
                  _self.set("oldAuthCode","");
                  _self.set("theText","");
                  _self.set("checkOldPhoneModel",false);
                  _self.set("showNewLoginName",true);
                  _self.set("theTextModel",false);
                  _self.set('secondS',0);
                  _self.set('isSSend',false);
                }
            });
        });
      },
      checkMobile: function()  { //只输入数字的方法
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if ((e.keyCode >= 48 && e.keyCode <= 57)||(e.keyCode >= 96 && e.keyCode <= 110)||e.keyCode === 8||e.keyCode === 9||e.keyCode === 13||(e.keyCode >= 33 && e.keyCode <= 43)||e.keyCode === 46){
          e.returnValue = true;
        }
        else {
          e.returnValue = false;
        }
      },

    }
});
