import Ember from 'ember';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/employee-leave';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  constants: Constants,
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  leaveObs: function() {
    var model = this.get("leave");
    if (!model) {
      return null;
    }
    var leaveModel = new Changeset(model, lookupValidator(TradeValidations), TradeValidations);
    this.set("leaveModel", leaveModel);
  }.observes("leave"),
  actions: {
    invalid() {},
    applicantSelect: function(employee) {
      this.set("leaveModel.applicant", employee);
    },
    saveAction: function(leave) {
      var _self = this;
      var leaveModel = this.get("leaveModel");
      var mainpageController = App.lookup('controller:business.mainpage');
      var id = this.get('id');
      leaveModel.set('flowStatus',0);//将请假状态改为申请
      leaveModel.validate().then(function() {
        if (leaveModel.get('errors.length') === 0) {
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          leaveModel.save().then(function() {
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (_self.get("editMode")=="edit") {
              if(leave.get('remark')){
                  mainpageController.switchMainPage('employee-leave');
              }
              _self.set('detailEdit', false);
            } else {
              mainpageController.switchMainPage('employee-leave');
              _self.set('detailEdit', false);
            }
          },function(err){
            let error = err.errors[0];
            if (error.code ==1) {
                    App.lookup('controller:business.mainpage').showAlert("该员工有未完成的请假流程,不能重复添加");
                    App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
            }
            if (error.code == 0) {
                    App.lookup('controller:business.mainpage').showAlert("该请假已经结算,不能进行修改");
                    App.lookup('controller:business.mainpage').showPopTip("保存失败", false);
            }
          });
        } else {
          leaveModel.set("validFlag", Math.random());
        }
      });
    },
    deleteAction: function(leave) {
      var self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此请假记录", function() {
        App.lookup('controller:business.mainpage').openPopTip("正在删除");
        var leaveModel = self.get("leaveModel");
        leaveModel.set("delStatus", 1);
        leaveModel.save().then(
          function() {
            App.lookup('controller:business.mainpage').showPopTip("删除成功");
            App.lookup('route:business.mainpage.customer-leave').refresh();
            App.lookup('controller:business.mainpage').switchMainPage('employee-leave');
          }
        );
      });
    },
    editAction: function() {
      var status=this.get("leaveModel.status");
      this.set("detailEdit", true);
    },
    //取消
    detailCancel: function() {
      if(this.get("editMode")=="edit"){
        this.set("detailEdit",false);
      }else {
          App.lookup('controller:business.mainpage').switchMainPage("employee-leave");
      }
    },
    changeStartTime: function(date) {
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      let minDate = this.get('dateService').timestampToTime(stamp);
      this.set("leaveModel.expectStartTimeDate", minDate);
      this.set("leaveModel.expectStartTime", stamp);
    },
    changeExpectEndTime: function(date) {
      let stamp = this.get("dateService").timeStringToTimestamp(date);
      this.set("leaveModel.expectEndTime", stamp);
    },
    leaveTypeSelect: function(type) {
      this.set("leaveModel.type", type);
    }
  },
});
