import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import informationValidations from '../../validations/information';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Component.extend(informationValidations, {
    addDict: false,
    showData: false,
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    informationModel: Ember.computed("information", function() {
        var model = this.get("information");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(informationValidations), informationValidations);
    }),
    actions: {
        invalid() {
            //alert("invalid");
        },
        //编辑
        editClick: function() {
            this.set("showData", true);
        },
        //删除
        delateClick: function(information) {
            var _self = this;
            _self.set('showpopInvitePassModal', false);
            this.get("store").query("customer", {
                filter: {
                    "[diningStandard][id]": information.id
                }
            }).then(function(customerList) {
                if (customerList.get("content.length")) {
                    console.log("del customerList is", customerList);
                    App.lookup('controller:business.mainpage').showPopTip("您删除的餐饮等级正在使用，不能删除",false);
                } else {
                    App.lookup('controller:business.mainpage').showConfirm("是否确定删除此服务信息", function() {
                        App.lookup('controller:business.mainpage').openPopTip("正在删除");
                        information.set("delStatus", 1);
                        information.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("删除成功");

                            _self.send('refreshStaffList');
                        });
                    });
                }
            });
        },
        //进入详情
        toDetailPage: function(information) {
            var _self = this;
            this.set('showpopInvitePassModal', true);
            this.set("information", information);
            this.set("addDict", false);
            this.set("showData", false);
        },
        //添加按钮
        addData: function() {
            var _self = this;
            this.set('showpopInvitePassModal', true);
            let information = this.get("store").createRecord('dicttypetenant', {});
            information.set('typeValue',0);
            information.set('totalPrice',0);
            this.set('information', information);
            this.set("addDict", true);
            this.set("showData", true);
        },
        //弹窗取消
        invitation() {
            this.set('showpopInvitePassModal', false);
        },
        //保存按钮
        saveClick: function() {
            var _self = this;
            var informationModel = this.get("informationModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            informationModel.validate().then(function() {
                if (informationModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    if (_self.get("addDict")) {
                        informationModel.set('typegroupTenant', _self.get("group"));
                        informationModel.set('typecode', pinyinUtil.getFirstLetter(_self.get("informationModel.typename")));
                    }
                    informationModel.save().then(function() {
                        _self.set("showpopInvitePassModal", false);
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        _self.send('refreshStaffList');
                    },function(err){
                      let error = err.errors[0];
                      if(error.code==="4"){
                        informationModel.validate().then(function(){
                          informationModel.addError('typename',['该名称已被占用']);
                          informationModel.set("validFlag",Math.random());
                          App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                        });
                      }
                    });
                } else {
                    informationModel.set("validFlag", Math.random());
                }
            });
        },
        refreshStaffList: function() {
            this.sendAction('refreshStaffList');
        },
    }
});
