import Ember from 'ember';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/customer-leave';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  constants: Constants,
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  statusList: [{
    "name": "已请假",
    "value": 0
  }, {
    "name": "请假中",
    "value": 1
  }, {
    "name": "已完成",
    "value": 2
  }, {
    "name": "已结算",
    "value": 3
  }],
  allowEdit:false,
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
    customerSelect: function(customer) {
      this.set("leaveModel.customer", customer);
    },
    saveAction: function(leave) {
      var _self = this;
      var leaveModel = this.get("leaveModel");
      var mainpageController = App.lookup('controller:business.mainpage');
      var id = this.get('id');
      leaveModel.validate().then(function() {
        if (leaveModel.get('errors.length') === 0) {
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          leaveModel.save().then(function() {
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (_self.get("editMode")=="edit") {
              _self.set('detailEdit', false);
            } else {
              mainpageController.switchMainPage('customer-leave');
              _self.set('detailEdit', false);
            }
          },function(err){
            let error = err.errors[0];
            if (error.code ==1) {
                    App.lookup('controller:business.mainpage').showAlert("该老人有未完成的请假流程,不能重复添加");
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
            App.lookup('controller:business.mainpage').switchMainPage('customer-leave');
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
          App.lookup('controller:business.mainpage').switchMainPage("customer-leave");
      }
    },
    changeStartTime: function(date) {
      this.changeTime(date, "leaveModel.startTime");
    },
    changeEndTime: function(date) {
      this.changeTime(date, "leaveModel.endTime");
    },
    changeExpectEndTime: function(date) {
      this.changeTime(date, "leaveModel.expectEndTime");
    },
    leaveReasonSelect: function(leaveReason) {
      this.set("leaveModel.leaveReason", leaveReason);
    }
  },
  changeTime: function(date, field) {
    if (!date) {
      return;
    }
    var stamp = this.get("dateService").timeToTimestamp(date);
    this.set(field, stamp);
  }
});
