import Ember from 'ember';
import Changeset from 'ember-changeset';
import ActivityValidations from '../../../validations/activity-order';
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
        var model = this.get("activityOrder");
        console.log("model activityOrder", model);
        if (!model) {
            return null;
        }
        var activityOrderModel = new Changeset(model, lookupValidator(ActivityValidations), ActivityValidations);
        this.set("activityOrderModel", activityOrderModel);
    }.observes("activityOrder"),
    refreshStaffList: function() {
        var route = App.lookup('route:business.mainpage.activity-plan-management');
        App.lookup('controller:business.mainpage').refreshPage(route);
    },
    //根据id获取activityPlanList
    showOrderItem:function(activityId){
      console.log("activityId in init",activityId);
      var _self = this;
      this.store.query("activityPlan",{
        filter:{
          activity:{id:activityId}
        }
      }).then(function(activityPlanList){
        activityPlanList.forEach(function(activityPlan) {
            activityPlan.set('activityPlanPinyin', activityPlan.get("name"));
        });
        _self.set("activityPlanList", activityPlanList);
        var activityPlan = activityPlanList.get('firstObject');
        _self.get('activityOrderModel').set('activityPlan',null);
      });
    },
    actions: {
        dpShowAction(e) {},
        invalid() {
            //alert("invalid");
        },
        changeActivityTimeAction(date) {
            console.log("date is who", date);
            var stamp = this.get("dateService").timeToTimestamp(date);
            this.set("activityOrderModel.activityTime", stamp);
        },
        selectCustomer:function(customer){
          this.get('activityOrder').set('customer',customer);
          this.get('activityOrderModel').set('customer',customer);
        },
        selectEmployee:function(employee){
          this.get('activityOrder').set('employee',employee);
          this.get('activityOrderModel').set('employee',employee);
        },
        selectActivity:function(activity){
          var _self = this;
          var activityId = activity.get("id");
          _self.set('activitySelect',activity);
          // _self.get('activityOrderModel').get("activityPlan").set('activity',activity);
          this.showOrderItem(activityId);
        },
        selectActivityPlan:function(activityPlan){
          this.get('activityOrder').set('activityPlan',activityPlan);
          this.get('activityOrderModel').set('activityPlan',activityPlan);
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
                this.get("activityOrder").rollbackAttributes();
                this.set("activityOrderModel", new Changeset(this.get("activityOrder"), lookupValidator(ActivityValidations), ActivityValidations));
            } else {
                mainpageController.switchMainPage('activity-order-search', {});
            }
        },
        //存储
        saveActivityPlan() {
            console.log("++++++++++++delFlag+++++++++++++", this.get("delFlag"));
            if (this.get("delFlag")) {
                //alert("保存进来了");
                var _self = this;
                _self.set('activitySelect',null);
                _self.set('activityPlanList',null);
                var activityOrderModel = this.get("activityOrderModel");
                var mainpageController = App.lookup('controller:business.mainpage');
                var editMode = this.get('editMode');
                var id = this.get('id');
                activityOrderModel.validate().then(function() {
                    if (activityOrderModel.get('errors.length') === 0) {
                        App.lookup('controller:business.mainpage').openPopTip("正在保存");
                        activityOrderModel.save().then(function() {
                            App.lookup('controller:business.mainpage').showPopTip("保存成功");
                            if (id && editMode == 'edit') {
                                console.log("id is", id);
                                console.log("editMode is", editMode);
                                _self.set('detailEdit', false);
                            } else {
                                mainpageController.switchMainPage('activity-order-search');
                                _self.set('detailEdit', false);
                            }
                        },function(err){
                          let error = err.errors[0];
                          if(error.code==="2"){
                              App.lookup("controller:business.mainpage").showAlert("该活动预约已经存在");
                              App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
                          }
                        });
                    } else {
                        activityOrderModel.set("validFlag", Math.random());
                    }
                });
            }
        },
        //删除按钮
        delById: function() {
            this.set("delFlag", false);
            var activityOrder=this.get('activityOrder');
            var _self = this;
            App.lookup('controller:business.mainpage').showConfirm("是否确定删除此活动计划", function() {
                App.lookup('controller:business.mainpage').openPopTip("正在删除");
                activityOrder.set("delStatus", 1);
                activityOrder.save().then(function() {
                    App.lookup('controller:business.mainpage').showPopTip("删除成功");
                    _self.set("delFlag", true);
                    var mainpageController = App.lookup('controller:business.mainpage');
                    mainpageController.switchMainPage('activity-order-search');
                });
            });
        },
    }
});
