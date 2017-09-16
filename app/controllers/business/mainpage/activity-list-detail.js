import Ember from 'ember';
import Changeset from 'ember-changeset';
import ActivityValidations from '../../../validations/activity-hold-info';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(ActivityValidations, {
    constants: Constants,
    detailEdit: false,
    delFlag: true,
    dateService: Ember.inject.service("date-service"),
    store: Ember.inject.service("store"),
    pathConfiger: Ember.inject.service("path-configer"),
    uploadUrl: Ember.computed('property', function() {return this.get("pathConfiger").get("uploadUrl");}),
    today: Ember.computed(function() {
        let today = this.get('dateService').getCurrentTime();
        //today=parseInt(today)-86400;
        today = this.get("dateService").timestampToTime(today);
        console.log('today is:',today);
        return today;
    }),
    activityObs: function() {
        var model = this.get("holdInfo");
        console.log("model holdInfo", model);
        if (!model) {
            return null;
        }
        var activityModel = new Changeset(model, lookupValidator(ActivityValidations), ActivityValidations);
        this.set("activityModel", activityModel);
    }.observes("holdInfo"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.activity-list');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    actions: {
        dpShowAction(e) {},
        invalid() {

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
            if (id && editMode == 'edit') {
                this.get("holdInfo").rollbackAttributes();
                this.set("activityModel", new Changeset(this.get("holdInfo"), lookupValidator(ActivityValidations), ActivityValidations));
            } else {
                mainpageController.switchMainPage('activity-list', {});
            }
        },
        //存储
        saveActivity() {
            if (this.get("delFlag")) {
                var _self = this;
                var activityModel = this.get("activityModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                activityModel.validate().then(function() {
                  console.log('activity:errors',activityModel.get('errors.length')+':'+activityModel.get('errors').get('firstObject'));
                  console.log('activity:contents',activityModel.get('contents'));
                    if (activityModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        activityModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('activity-list');
                                _self.set('detailEdit', false);
                            }
                        });
                    } else {
                        activityModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        changeHoldTimeAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("activityModel.holdTime", stamp);
        },
        // 图片上传成功
        uploadSucc1: function(response) {
          var res = JSON.parse(response);
          var pic = res.relativePath;
          console.log("pic:",pic);
          this.set("activityModel.picPath1",pic);
        },
        uploadSucc2: function(response) {
          var res = JSON.parse(response);
          var pic = res.relativePath;
          this.set("activityModel.picPath2",pic);
        },
        uploadSucc3: function(response) {
          var res = JSON.parse(response);
          var pic = res.relativePath;
          this.set("activityModel.picPath3",pic);
        },
        uploadSucc4: function(response) {
          var res = JSON.parse(response);
          var pic = res.relativePath;
          this.set("activityModel.picPath4",pic);
        },
        uploadSucc5: function(response) {
          var res = JSON.parse(response);
          var pic = res.relativePath;
          this.set("activityModel.picPath5",pic);
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var holdInfo=this.get('holdInfo');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此活动总结", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                holdInfo.set("delStatus", 1);
                holdInfo.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('activity-list');
                });
            });
        },
        selectActivity:function(activityPlan){
          this.get("holdInfo").set("activityPlan", activityPlan);
          this.get("activityModel").set("activityPlan", activityPlan);
        },
    }
});
