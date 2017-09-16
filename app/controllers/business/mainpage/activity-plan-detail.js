import Ember from 'ember';
import Changeset from 'ember-changeset';
import ActivityValidations from '../../../validations/activity-plan';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ActivityValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        //today=parseInt(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    activityObs: function() {
        var model = this.get("activityPlan");
        console.log("model activityPlan", model);
        if (!model) {
            return null;
        }
        var activityPlanModel = new Changeset(model, lookupValidator(ActivityValidations), ActivityValidations);
        this.set("activityPlanModel", activityPlanModel);
    }.observes("activityPlan"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.activity-plan-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function() {
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
                this.get("activityPlan").rollbackAttributes();
                this.set("activityPlanModel", new Changeset(this.get("activityPlan"), lookupValidator(ActivityValidations), ActivityValidations));
            } else {
                mainpageController.switchMainPage('activity-plan-management', {});
            }
        },
        //存储
        saveActivityPlan() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                var activityPlanModel = this.get("activityPlanModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                activityPlanModel.validate().then(function() {
                    if (activityPlanModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        activityPlanModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('activity-plan-management');
                                _self.set('detailEdit', false);
                            }
                        },function(err){
                          let error = err.errors[0];
                          if(error.code==="1"){
                              App.lookup("controller:business.mainpage").showAlert("该活动计划已存在");
                              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                          }
                        });
                    } else {
                        activityPlanModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var activityPlan=this.get('activityPlan');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此活动计划", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                activityPlan.set("delStatus", 1);
                activityPlan.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('activity-plan-management');
                },function(err){
                  let error = err.errors[0];
                  if(error.code==="0"){
                      App.lookup("controller:business.mainpage").showAlert("该活动计划老人已预订,不可删除");
                      App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
                  }
                });
            });
        },
        selectActivity:function(activity){
          this.get("activityPlan").set("activity", activity);
          this.get("activityPlanModel").set("activity", activity);
        },
        weekSelect(weekDict) {
            this.get("activityPlan").set("day", weekDict);
        },
    }
});
