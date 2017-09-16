import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
import Changeset from 'ember-changeset';
import CustomerValidations from '../../validations/customer-drug-scheme';
import lookupValidator from 'ember-changeset-validations';

export default BaseItem.extend(CustomerValidations, {
    constants: Constants,
    statusService: Ember.inject.service("current-status"),
    store: Ember.inject.service("store"),
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    dataLoader: Ember.inject.service("data-loader"),
    uploadUrl: Ember.computed('property', function() {
        return this.get("pathConfiger").get("uploadUrl");
    }),
    drugShemeModel: Ember.computed("drugShemeInfo", function() {
        var model = this.get("drugShemeInfo");
        console.log("model drugShemeInfo", model);
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
        //查询给老人绑定的膳食方案
        this.get('store').query('drug-advice', {
            filter: {
                '[customer][id]': _self.get('customerInComp.id'),
            }
        }).then(function(drugShemeList) {
            if (drugShemeList.get('length')) {
                _self.set('drugShemeInfo', drugShemeList.get('firstObject'));
            } else {
                _self.set('drugShemeInfo', _self.get('store').createRecord('drug-advice', {
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
            var drugShemeInfo = this.get('drugShemeInfo');
            var drugShemeModel = this.get('drugShemeModel');
            console.log('save:drugShemeModel is',drugShemeModel);
            drugShemeModel.validate().then(function() {
              console.log('save:errors',drugShemeModel.get('errors'));
                if (drugShemeModel.get('errors.length') === 0) {
                    App.lookup('controller:business.mainpage').openPopTip("正在保存");
                    drugShemeModel.save().then(function() {
                        App.lookup('controller:business.mainpage').showPopTip("保存成功");
                        _self.set('detailModify', false);
                        _self.set('accountFlag', 0);
                    });
                } else {
                    drugShemeModel.set("validFlag", Math.random());
                }
            });
        },
        //取消按钮
        cancelClick: function() {
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailModify', false);
            if (!this.get('addMode')) {
                this.get("drugShemeInfo").rollbackAttributes();
                this.set("drugShemeModel", new Changeset(this.get("drugShemeInfo"), lookupValidator(CustomerValidations), CustomerValidations));
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
            var drugShemeInfo = this.get('drugShemeInfo');
            var mainpageController = App.lookup('controller:business.mainpage');
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此老人绑定的用药方案", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                drugShemeInfo.set("delStatus", 1);
                drugShemeInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('member-management');
                });
            });
        },
        uploadSucc: function(response) {
            var res = JSON.parse(response);
            var pic = res.relativePath;
            this.set("drugShemeModel.picPath", pic);
        },
    }
});
