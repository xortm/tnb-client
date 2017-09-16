import Ember from 'ember';
import Changeset from 'ember-changeset';
import SchedulingValidations from '../../../validations/scheduling';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(SchedulingValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    // schedulingModel: Ember.computed("detailEdit","scheduling.id", function() {
    //     var model = this.get("scheduling");
    //     console.log("model scheduling", model);
    //     if (!model) {
    //         return null;
    //     }
    //     return new Changeset(model, lookupValidator(schedulingValidations), schedulingValidations);
    // }),
    schedulingModel:Ember.computed("scheduling",function(){
      var model = this.get("scheduling");
      if (!model) {
          return null;
      }
      return new Changeset(model, lookupValidator(SchedulingValidations), SchedulingValidations);
    }),
    // schedulingObs: function() {
    //     var model = this.get("scheduling");
    //     console.log("model scheduling", model);
    //     if (!model) {
    //         return null;
    //     }
    //     var schedulingModel = new Changeset(model, lookupValidator(SchedulingValidations), SchedulingValidations);
    //     this.set("schedulingModel", schedulingModel);
    // }.observes("scheduling"),
    // refreshUserList: function() {
    //     var route = App.lookup('route:business.mainpage.nursing-staff-scheduling');
    //     //route.refresh();
    //     App.lookup('controller:business.mainpage').refreshPage(route);
    // },
    defaultUser: Ember.computed('scheduling.user', 'userListFirst', function() {
        console.log('defaultUser',this.get('scheduling.user'));
        return this.get('scheduling.user');

    }),
    // defaultAdd: Ember.computed('scheduling.createUser', 'userListFirst', function() {
    //     //if (this.get('scheduling.operater') && this.get('scheduling.operater').content) {
    //     return this.get('scheduling.createUser');
    //     //}
    //     //return this.get('staffListFirst');
    // }),
    actions: {
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(scheduling) {
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
                this.get("scheduling").rollbackAttributes();
                this.set("schedulingModel", new Changeset(this.get("scheduling"), lookupValidator(SchedulingValidations), SchedulingValidations));
            } else {
                mainpageController.switchMainPage('nursing-staff-scheduling', {});
            }
        },
        //保储
        saveScheduling() {
            // alert("保存");
            // console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                // alert("保存进来了");
                var _self = this;
                var schedulingModel = this.get("schedulingModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                schedulingModel.validate().then(function() {
                    //alert("save   out");
                    if (schedulingModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        schedulingModel.save().then(function() {
                          App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('nursing-staff-scheduling');
                                _self.set('detailEdit', false);
                            }
                        });

                    } else {
                        schedulingModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //工作类型
        typeSelect(type) {
            this.set('scheduling.type',type);
            this.set('schedulingModel.type',type);
        },
        //排班人员
        selectNurse(user) {
            this.get('schedulingModel').set("user", user);
            this.set("defaultUser", user);
            //console.log("+++++name++++++",name);
        },
        //添加人
        // selectUser(user) {
        //     this.set("user", user);
        //     this.get("scheduling").set("createUser", user);
        // },
        changeStartTimeAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("schedulingModel.startTime", stamp);
        },
        changeEndTimeAction(date) {
            var stamp = this.get("dateService").getLastSecondStampOfDay(date);
            this.set("schedulingModel.endTime", stamp);
        },
        //删除按钮
        delById: function(scheduling) {
            //this.set('showpopInvitePassModal', true);
            this.set("delFlag", false);
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此排班记录", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                scheduling.set("delStatus", 1);
                scheduling.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    //console.log("delFlag删除", _self.get("delFlag"));
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('nursing-staff-scheduling');
                });
            });
        },
        dpShowAction(e){

        },
        //弹窗取消
        // invitation() {
        //     this.set('showpopInvitePassModal', false);
        //     this.set("delFlag", true);
        // },
        //弹窗确定，删除记录
        // cancelPassSubmit(scheduling) {
        //     var _self = this;
        //     App.lookup('controller:business.mainpage').openPopTip("正在删除");
        //     this.set("showpopInvitePassModal", false);
        //     scheduling.set("delStatus", 1);
        //     scheduling.save().then(function() {
        //         App.lookup('controller:business.mainpage').showPopTip("删除成功");
        //         _self.set("delFlag", true);
        //         console.log("delFlag删除", _self.get("delFlag"));
        //         var mainpageController = App.lookup('controller:business.mainpage');
        //         mainpageController.switchMainPage('scheduling-management');
        //
        //     });
        // },

    }
});
