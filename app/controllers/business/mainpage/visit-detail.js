import Ember from 'ember';
import Changeset from 'ember-changeset';
import VistValidations from '../../../validations/vist';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(VistValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),

    vistObs: function() {
        var model = this.get("vist");
        console.log("model vist", model);
        if (!model) {
            return null;
        }
        var vistModel = new Changeset(model, lookupValidator(VistValidations), VistValidations);
        this.set("vistModel", vistModel);
    }.observes("vist"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.visit-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    abd: function() {},
    defaultStaff: Ember.computed('vist.vistUser', 'staffListFirst', function() {
        return this.get('vist.vistUser');
    }),
    actions: {
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(vist) {
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
                this.get("vist").rollbackAttributes();
                this.set("vistModel", new Changeset(this.get("vist"), lookupValidator(VistValidations), VistValidations));
            } else {
                mainpageController.switchMainPage('visit-management', {});
            }
        },
        //存储
        saveWarning() {
            //alert("保存");
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var vistModel = this.get("vistModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                //var consultId=this.get('consultId');
                console.log("consultId is",this.get('consultId'));
                var consult=this.store.peekRecord('consultinfo',this.get('consultId'));
                console.log("consult is what",consult);
                vistModel.set("consultInfo",consult);
                vistModel.validate().then(function() {
                    //alert("save   out");
                    if (vistModel.get('errors.length') === 0) {

                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        vistModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('visit-management');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        vistModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //删除按钮
        delById: function(vist) {
            this.set("delFlag", false);
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此回访记录", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                vist.set("delStatus", 1);
                vist.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    //console.log("delFlag删除", _self.get("delFlag"));
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('visit-management');
                });
            });
        },
        dpShowAction(e) {
        },
        //接待人
        selectStaff(staff) {
            this.set("staff", staff);
            this.get("vist").set("vistUser", staff);
        },
        //回访时间
        changeDateAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("vistModel.createDateTime", stamp);
        },
        //回访类型
        backVistSelect: function(backVistDict) {
            this.get("vist").set("backVistType", backVistDict);
        },
    }
});
