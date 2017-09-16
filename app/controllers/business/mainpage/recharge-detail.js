import Ember from 'ember';
import Changeset from 'ember-changeset';
import RechargeValidations from '../../../validations/recharge';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(RechargeValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    rechargeObs: function() {
        var model = this.get("recharge");
        console.log("model recharge", model);
        if (!model) {
            return null;
        }
        var rechargeModel = new Changeset(model, lookupValidator(RechargeValidations), RechargeValidations);
        this.set("rechargeModel", rechargeModel);
    }.observes("recharge"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.recharge-management');
        //route.refresh();
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    abd: function() {},
    defaultAccount: Ember.computed('recharge.rechargeAccount.customer', 'accountListFirst', function() {
        console.log('name:', this.get('recharge.rechargeAccount.customer.name'));
        return this.get('recharge.rechargeAccount.customer');
    }),
    actions: {
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(recharge) {
            this.set('detailEdit', true);
        },
        //取消按钮
        detailCancel: function() {
            var id = this.get('id');
            var editMode = this.get('editMode');
            var mainpageController = App.lookup('controller:business.mainpage');
            this.set('detailEdit', false);
            //alert("详情");
            if (id && editMode == 'edit') {
                this.get("recharge").rollbackAttributes();
                this.set("rechargeModel", new Changeset(this.get("recharge"), lookupValidator(RechargeValidations), RechargeValidations));
            } else {
                mainpageController.switchMainPage('recharge-management', {});
            }
        },
        //存储
        saveRecharge() {
            //alert("保存");
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var rechargeModel = this.get("rechargeModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                rechargeModel.validate().then(function() {
                    if (rechargeModel.get('errors.length') === 0) {
                        console.log('rechargeCustomer is what', _self.get('rechargeCustomer.id'));
                        console.log('accountTypeDict is what', _self.get('accountTypeDict.typecode'));
                        _self.get("store").query('tradeaccount', {
                            filter: {
                                '[customer][id]': _self.get('rechargeCustomer.id'),
                                '[type][typecode]': _self.get('accountTypeDict.typecode')
                            }
                        }).then(function(tradeAccountList) {
                            console.log('tradeAccountList is', tradeAccountList);
                            console.log('tradeAccountList firstObject', tradeAccountList.get('firstObject'));
                            rechargeModel.set('rechargeAccount', tradeAccountList.get('firstObject'));
                            App.lookup('controller:business.mainpage').openPopTip("正在保存");
                            rechargeModel.save().then(function() {
                                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                                if (id && editMode == 'edit') {
                                    console.log("id is", id);
                                    console.log("editMode is", editMode);
                                    _self.set('detailEdit', false);
                                } else {
                                    mainpageController.switchMainPage('recharge-management');
                                    _self.set('detailEdit', false);
                                }
                            });
                        });
                    } else {
                        rechargeModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //删除按钮
        delById: function(recharge) {
            //this.set('showpopInvitePassModal', true);
            this.set("delFlag", false);
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此充值记录", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                recharge.set("delStatus", 1);
                recharge.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('recharge-management');
                });
            });
        },
        dpShowAction(e) {},
        selectCustomer(rechargeCustomer) {
            this.set('rechargeCustomer', rechargeCustomer);
            this.get('rechargeModel').set('rechargeCustomer', rechargeCustomer);
        },
        accountTypeSelect(accountTypeDict) {
            this.set('accountTypeDict', accountTypeDict);
        },
        changeCreateDateAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("rechargeModel.createDateTime", stamp);
        },
        channelSelect(channelTypeDict) {
            this.get("recharge").set("channel", channelTypeDict);
        },
    }
});
