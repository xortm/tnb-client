import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import SystemValidations from '../../validations/system-info';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(SystemValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    systemModel: Ember.computed("usercustomer", function() {
        var model = this.get("usercustomer");
        console.log("model usercustomer", model);
        if (!model) {
            return null;
        }
        let u = this.get('store').peekRecord("user",model.get("id"));
        if (!u) {
            return null;
        }
        return new Changeset(u, lookupValidator(SystemValidations), SystemValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.member-management');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    detailModify: Ember.computed("addMode", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
    }),
    changeObs: function() {
        var _self = this;
        //查询customer对应的系统用户(居家养老)
        this.get('store').query('staffcustomer',{filter:{
          '[customer][id]':_self.get('customerInfo.id')
        }}).then(function(staffcustomerList){
          console.log('system-info:staffcustomerList',staffcustomerList);
          var staffcustomer=staffcustomerList.get('firstObject');
          var usercustomer=staffcustomer.get('staff');
          console.log('system-info:usercustomer',usercustomer);
          _self.set('usercustomer',usercustomer);
          _self.set("sysPassWord", usercustomer.get("passcode"));//以前的密码md5加密
        });
    }.observes("systemFlag").on('init'),
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //修改
        detailModifyClick: function() {
            this.set('detailModify', true);
        },
        //保存按钮
        detailSaveClick: function() {
            var _self = this;
            var sysPassWord = this.get("sysPassWord");//以前的密码md5加密
            var usercustomer=this.get('usercustomer');
            console.log('detailSaveClick:usercustomer',usercustomer);
            var systemModel=this.get('systemModel');
            var passcode = systemModel.get("passcode");
            console.log('systemModel is',systemModel);
            console.log('systemModel',systemModel);
            // if(passcode==sysPassWord){//相等 证明没有变动
            //   systemModel.set("passcode",passcode);
            // }else {
            //   systemModel.set("passcode",$.md5(passcode));
            // }
            systemModel.validate().then(function(){
              console.log('system-info:errors',systemModel.get('errors'));
              if (systemModel.get('errors.length') === 0){
                //alert("1111111111111111");
                systemModel.set("passcode",$.md5(passcode));
                App.lookup('controller:business.mainpage').openPopTip("正在保存");
                systemModel.save().then(function(){
                  //alert("1111111111111111 save");
                      App.lookup('controller:business.mainpage').showPopTip("保存成功");
                      if (_self.get('addMode')) {
                          _self.set('detailModify', false);
                      }
                      _self.set('detailModify', false);
                      _self.set('systemFlag', 0);
                    }, function(err) {
                        console.log("save err!");
                        console.log("err:",err);
                        let error = err.errors[0];
                        if (error.code === "4") {
                          App.lookup("controller:business.mainpage").showAlert("该用户名已经存在");
                          App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                        }
                    });
              }else {
              systemModel.set("validFlag", Math.random());
              }
            });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("usercustomer").rollbackAttributes();
                this.set("systemModel", new Changeset(this.get("usercustomer"), lookupValidator(SystemValidations), SystemValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('member-management', {
                    //flag: 'edit-add'
                });
            }
        },
        //删除按钮
        delById: function() {
            var _self = this;
            var customerInfo = this.get('customerInfo');
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此会员的所有信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                // 删除customer user staffcustomer表中的数据
                customerInfo.set("delStatus", 1);
                customerInfo.save().then(function() {
                      App.lookup('controller:business.mainpage').showPopTip("删除成功");
                      var mainpageController = App.lookup('controller:business.mainpage');
                      mainpageController.switchMainPage('member-management', {});
                });
            });
        },
    }
});
