import Ember from 'ember';
import Changeset from 'ember-changeset';
import ActivityValidations from '../../../validations/activity';
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
        var model = this.get("activity");
        console.log("model activity", model);
        if (!model) {
            return null;
        }
        var activityModel = new Changeset(model, lookupValidator(ActivityValidations), ActivityValidations);
        this.set("activityModel", activityModel);
    }.observes("activity"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.activity-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    defaultStaff: Ember.computed('warning.operater', 'staffListFirst', function() {
        return this.get('warning.operater');
    }),
    checkActivity: function(title){

    },
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        //编辑按钮
        detailEditClick: function(activity) {
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
                this.get("activity").rollbackAttributes();
                this.set("activityModel", new Changeset(this.get("activity"), lookupValidator(ActivityValidations), ActivityValidations));
            } else {
                mainpageController.switchMainPage('activity-management', {});
            }
        },
        //存储
        saveActivity() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
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
                                mainpageController.switchMainPage('activity-management');
                                _self.set('detailEdit', false);
                            }
                        },function(err){
                          let error = err.errors[0];
                          if(error.code==="2"){
                              App.lookup("controller:business.mainpage").showAlert("该活动项目已存在");
                              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                          }
                        });
                    } else {
                        activityModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //处理人
        // selectStaff(staff) {
        //     this.set("staff", staff);
        //     this.get("warning").set("operater", staff);
        // },
        // changeCallTimeAction(date) {
        //     console.log("date is who", date);
        //     var stamp = this.get("dateService").timeToTimestamp(date);
        //     this.set("warningModel.callTime", stamp);
        // },
        //活动类型
        typeSelect(typeDict) {
            this.get("activity").set("type", typeDict);
        },
        // 图片上传成功
        uploadSucc: function(response) {
          var res = JSON.parse(response);
          var pic = res.relativePath;
          console.log("pic:",pic);
          this.set("activityModel.pic",pic);
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var activity=this.get('activity');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此活动项目", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                activity.set("delStatus", 1);
                activity.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('activity-management');
                },function(err){
                  let error = err.errors[0];
                  if(error.code==="0"){
                      App.lookup("controller:business.mainpage").showAlert("该活动项目已生成活动计划,不可删除");
                      App.lookup('controller:business.mainpage').showPopTip("删除失败",false);
                  }
                });
            });
        },
    }
});
