import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-sport-scheme';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    sportShemeModel: Ember.computed("sportShemeInfo", function() {
        var model = this.get("sportShemeInfo");
        console.log("model sportShemeInfo", model);
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
        //查询所有的运动方案
        this.get('store').query('scheme', {
            filter: {
                '[type][typecode]': 'schemeType2'
            }
        }).then(function(sportList) {
            sportList.forEach(function(obj) {
                obj.set('namePinyin', obj.get('title'));
            });
            _self.set('sportList', sportList);
        });
        //查询给老人绑定的运动方案
        this.get('store').query('rel-customer-scheme', {
            filter: {
                '[customer][id]': _self.get('customerInComp.id'),
                '[scheme][type][typecode]': 'schemeType2'
            }
        }).then(function(sportShemeList) {
            if (sportShemeList.get('length')) {
                _self.set('sportShemeInfo', sportShemeList.get('firstObject'));
            } else {
                _self.set('sportShemeInfo', _self.get('store').createRecord('rel-customer-scheme', {
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
            var sportShemeInfo = this.get('sportShemeInfo');
            var sportShemeModel = this.get('sportShemeModel');
            sportShemeModel.validate().then(function() {
                if (sportShemeModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    sportShemeModel.save().then(function() {
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        _self.set('detailModify', false);
                        _self.set('accountFlag', 0);
                    });
                } else {
                    sportShemeModel.set("validFlag", Math.random());
                }
            });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("sportShemeInfo").rollbackAttributes();
                this.set("sportShemeModel", new Changeset(this.get("sportShemeInfo"), lookupValidator(CustomerValidations), CustomerValidations));
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
            var sportShemeInfo = this.get('sportShemeInfo');
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此老人绑定的运动方案", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                sportShemeInfo.set("delStatus", 1);
                sportShemeInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('member-management');
                });
            });
        },
        selectSport: function(sport) {
            console.log('sport is', sport + ":" + sport.get('id'));
            console.log('sportShemeInfo is', this.get("sportShemeInfo"));
            this.get("sportShemeInfo").set("scheme", sport);
            this.get("sportShemeModel").set("scheme", sport);
        },
    }
});
