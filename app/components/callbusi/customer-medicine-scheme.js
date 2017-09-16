import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-medicine-scheme';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    medicineShemeModel: Ember.computed("medicineShemeInfo", function() {
        var model = this.get("medicineShemeInfo");
        console.log("model medicineShemeInfo", model);
        if (!model) {
            return null;
        }
        return new Changeset(model, lookupValidator(CustomerValidations), CustomerValidations);
    }),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.member-management');
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
    didInsertElement: function() {
        var _self = this;
    },
    changeObs: function() {
        var _self = this;
        //查询所有的中医方案
        this.get('store').query('scheme', {
            filter: {
                '[type][typecode]': 'schemeType5'
            }
        }).then(function(medicineList) {
            medicineList.forEach(function(obj) {
                obj.set('namePinyin', obj.get('title'));
            });
            _self.set('medicineList', medicineList);
        });
        //查询给老人绑定的中医方案
        this.get('store').query('rel-customer-scheme', {
            filter: {
                '[customer][id]': _self.get('customerInComp.id'),
                '[scheme][type][typecode]': 'schemeType5'
            }
        }).then(function(medicineShemeList) {
            if (medicineShemeList.get('length')) {
                _self.set('medicineShemeInfo', medicineShemeList.get('firstObject'));
            } else {
                _self.set('medicineShemeInfo', _self.get('store').createRecord('rel-customer-scheme', {
                    customer: _self.get('customerInComp')
                }));
            }
        });
    }.observes("accountFlag").on('init'),
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
            var medicineShemeInfo = this.get('medicineShemeInfo');
            var medicineShemeModel = this.get('medicineShemeModel');
            medicineShemeModel.validate().then(function() {
                if (medicineShemeModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    medicineShemeModel.save().then(function() {
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        _self.set('detailModify', false);
                        _self.set('accountFlag', 0);
                    });
                } else {
                    medicineShemeModel.set("validFlag", Math.random());
                }
            });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("medicineShemeInfo").rollbackAttributes();
                this.set("medicineShemeModel", new Changeset(this.get("medicineShemeInfo"), lookupValidator(CustomerValidations), CustomerValidations));
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
            var customerInComp = this.get('customerInComp');
            var medicineShemeInfo = this.get('medicineShemeInfo');
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此老人绑定的中医方案", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                medicineShemeInfo.set("delStatus", 1);
                medicineShemeInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('member-management');
                });
            });
        },
        selectmedicine: function(medicine) {
            console.log('medicine is', medicine + ":" + medicine.get('id'));
            console.log('medicineShemeInfo is', this.get("medicineShemeInfo"));
            this.get("medicineShemeInfo").set("scheme", medicine);
            this.get("medicineShemeModel").set("scheme", medicine);
        },
    }
});
