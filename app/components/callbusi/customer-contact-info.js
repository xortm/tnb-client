import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-contact-info';
import lookupValidator from 'ember-changeset-validations';
export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    global_curStatus: Ember.inject.service("current-status"),
    //delFlag:true,
    customerModel: Ember.computed("customerInfo", function() {
        var model = this.get("customerInfo");
        console.log("model customerInfo", model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-service');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    detailModify: Ember.computed("addMode", "showCustomer", function() {
        var addMode = this.get("addMode");
        if (addMode) {
            return true;
        } else {
            return false;
        }
        if (showCustomer) {
            return false;
        } else {
            return true;
        }
    }),
    actions: {
        dpShowAction(e) {

        },
        computedFirstCardCode: function() {
            var guardianFirstCardCode = this.get("customerModel.guardianFirstCardCode");
            if(!guardianFirstCardCode){return;}
            console.log("guardianFirstCardCode is", guardianFirstCardCode);
            //计算性别
            if (parseInt(guardianFirstCardCode.substr(16, 1)) % 2 == 1) {
                var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
                console.log("manObj is", manObj);
                this.get("customerModel").set("guardianSexChange", manObj);
                this.get("customerModel").set("guardianFirstGener", manObj);
            } else {
                var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
                //var dictWoman= this.get("store").peekRecord("dicttype", womanObj.get("id"));
                console.log("womanObj is", womanObj);
                this.get("customerModel").set("guardianSexChange", womanObj);
                this.get("customerModel").set("guardianFirstGener", womanObj);
            }
        },
        computedSecondCardCode: function() {
            var guardianSecondCardCode = this.get("customerModel.guardianSecondCardCode");
            if(!guardianSecondCardCode){return;}
            console.log("guardianSecondCardCode is", guardianSecondCardCode);
            //计算性别
            if (parseInt(guardianSecondCardCode.substr(16, 1)) % 2 == 1) {
                var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
                console.log("manObj is", manObj);
                this.get("customerModel").set("guardianSecondChange", manObj);
                this.get("customerModel").set("guardianSecondGener", manObj);
            } else {
                var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
                //var dictWoman= this.get("store").peekRecord("dicttype", womanObj.get("id"));
                console.log("womanObj is", womanObj);
                this.get("customerModel").set("guardianSecondChange", womanObj);
                this.get("customerModel").set("guardianSecondGener", womanObj);
            }
        },
        computedThirdCardCode: function() {
            var guardianThirdCardCode = this.get("customerModel.guardianThirdCardCode");
            if(!guardianThirdCardCode){return;}
            //计算性别
            if (parseInt(guardianThirdCardCode.substr(16, 1)) % 2 == 1) {
                var manObj = this.get("dataLoader").findDict(Constants.sexTypeMale);
                this.get("customerModel").set("guardianThirdChange", manObj);
                this.get("customerModel").set("guardianThirdGener", manObj);
            } else {
                var womanObj = this.get("dataLoader").findDict(Constants.sexTypeFemale);
                //var dictWoman= this.get("store").peekRecord("dicttype", womanObj.get("id"));
                this.get("customerModel").set("guardianThirdChange", womanObj);
                this.get("customerModel").set("guardianThirdGener", womanObj);
            }
        },
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
            var customerModel = this.get("customerModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            //查询已入住状态
            var customerStatus = _self.get("dataLoader").findDict("customerStatusIn");
            customerModel.validate().then(function() {
                //alert("save   out");
                if (customerModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    if (_self.get('directSave')) {
                        customerModel.set('addRemark', 'directCreate');
                        customerModel.set('customerStatus', customerStatus);
                    }
                    customerModel.save().then(function() {
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        if (_self.get('addMode')) {
                            //alert("添加");
                            if(_self.get("global_curStatus.isJujia")){
                              mainpageController.switchMainPage('member-management', {});
                            }else {
                              mainpageController.switchMainPage('customer-service', {});
                            }
                        }
                        _self.set('detailModify', false);
                    });
                } else {
                    customerModel.set("validFlag", Math.random());
                    //alert("校验失败");
                }
            });
        },
        //暂存
        shortSaveInfo: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            customerModel.validate().then(function() {
                customerModel.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("保存成功");
                    mainpageController.switchMainPage('business-customer', {});
                    _self.sendAction('stagingAction');
                });
            });
        },
        //下一步
        next: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            customerModel.validate().then(function() {
                if (customerModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    _self.sendAction('goNext', customerModel);
                } else {
                    customerModel.set("validFlag", Math.random());
                    //alert("校验失败");
                }
            });
            // var mainpageController = App.lookup('controller:business.mainpage');
            // mainpageController.switchMainPage('try-customer', {});
        },
        //入住信息界面的取消
        remove: function() {
            var _self = this;
            var customerModel = this.get("customerModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            mainpageController.switchMainPage('business-customer', {});
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            //alert("详情");
            if (!this.get('addMode')) {
                this.get("customerInfo").rollbackAttributes();
                this.set("customerModel", new Changeset(this.get("customerInfo"), lookupValidator(CustomerValidations), CustomerValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('customer-service', {
                    //flag: 'edit-add'
                });
            }
        },

        //删除按钮
        delById: function() {
            //this.set('showpopInvitePassModal', true);
            var _self = this;
            var customerInfo=this.get('customerInfo');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此基本信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                customerInfo.set("delStatus", 1);
                customerInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('customer-service');
                });
            });
        },
        GenerSelect: function(GenerDict) {
            this.get("customerInfo").set("guardianFirstGener", GenerDict);
        }, //监护人性别字典
        secondGenerSelect: function(secondGenerDict) {
            this.get("customerInfo").set("guardianSecondGener", secondGenerDict);
        }, //第二联系人性别字典
       thirdGenerSelect: function(thirdGenerDict) {
           this.get("customerInfo").set("guardianThirdGener", thirdGenerDict);
       }, //第三联系人性别字典
        relationSelect: function(relationDict) {
            this.get("customerInfo").set("firstRelation", relationDict);
        }, //与老人关系字典
        secondRelationSelect: function(secondRelationDict) {
            this.get("customerInfo").set("secondRelation", secondRelationDict);
        }, //第二联系人与老人关系
        thirdRelationSelect: function(thirdRelationDict) {
            this.get("customerInfo").set("thirdRelation", thirdRelationDict);
        }, //第三联系人与老人关系
    }
});
