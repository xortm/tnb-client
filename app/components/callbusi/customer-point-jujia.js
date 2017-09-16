import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-point-info';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    global_curStatus: Ember.inject.service("current-status"),
    dataLoader: Ember.inject.service("data-loader"),
    customerModel: Ember.computed("customerInComp", function() {
        var model = this.get("customerInComp");
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.customer-service');
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
            var customerModel = this.get("customerModel");
            var mainpageController = App.lookup('controller:business.mainpage');
            //查询已入住状态
            // var customerStatus = _self.get("dataLoader").findDict("customerStatusIn");
            customerModel.validate().then(function() {
                if (customerModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    // if (_self.get('directSave')) {
                    //     customerModel.set('addRemark', 'directCreate');
                    //     customerModel.set('customerStatus', customerStatus);
                    // }
                    let customerExtendId = _self.get("customerInComp.customerExtend.id");
                    console.log("customerExtendId in addMode:",customerExtendId);
                    let customerExtend = _self.get('store').findRecord('customer-extend',customerExtendId).then(function(customerExtend) {
                      // if(_self.get("remark0")){
                      //   console.log("remark0:",_self.get("remark0"));
                      //   customerExtend.set('remark0',_self.get("remark0"));
                      // }
                      // if(_self.get("remark1")){
                      //   customerExtend.set('remark1',_self.get("remark1"));
                      // }
                      // if(_self.get("remark2")){
                      //   customerExtend.set('remark2',_self.get("remark2"));
                      // }
                      // if(_self.get("remark3")){
                      //   customerExtend.set('remark3',_self.get("remark3"));
                      // }
                      // if(_self.get("remark4")){
                      //   customerExtend.set('remark4',_self.get("remark4"));
                      // }
                      // if(_self.get("remark5")){
                      //   customerExtend.set('remark5',_self.get("remark5"));
                      // }
                      // if(_self.get("remark6")){
                      //   customerExtend.set('remark6',_self.get("remark6"));
                      // }
                      // if(_self.get("remark7")){
                      //   customerExtend.set('remark7',_self.get("remark7"));
                      // }
                      // if(_self.get("remark8")){
                      //   customerExtend.set('remark8',_self.get("remark8"));
                      // }
                      // if(_self.get("remark9")){
                      //   customerExtend.set('remark9',_self.get("remark9"));
                      // }
                      customerModel.set('customerExtend', customerExtend);
                    });
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
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            //alert("详情");
            if (!this.get('addMode')) {
                this.get("customerInComp").rollbackAttributes();
                this.set("customerModel", new Changeset(this.get("customerInComp"), lookupValidator(CustomerValidations), CustomerValidations));
            }
            if (this.get("addMode")) {
                mainpageController.switchMainPage('customer-service', {});
            }
        },
        //删除按钮
        delById: function() {
            var _self = this;
            var customerInComp=this.get('customerInComp');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此入住信息", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                customerInComp.set("delStatus", 1);
                customerInComp.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('customer-service');
                });
            });
        },
    }
});
