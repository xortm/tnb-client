import Ember from 'ember';
import Changeset from 'ember-changeset';
import TradeValidations from '../../../validations/customer-event';
import lookupValidator from 'ember-changeset-validations';
export default Ember.Controller.extend({
  constants: Constants,
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  eventObs: function() {
    var model = this.get("event");
    if (!model) {
      return null;
    }
    var eventModel = new Changeset(model, lookupValidator(TradeValidations), TradeValidations);
    this.set("eventModel", eventModel);
  }.observes("event"),
  actions: {
    invalid() {},
    customerSelect: function(customer) {
      this.set("eventModel.customer", customer);
    },
    saveAction: function(leave) {
      var _self = this;
      var eventModel = this.get("eventModel");
      var mainpageController = App.lookup('controller:business.mainpage');
      var id = this.get('id');
      eventModel.validate().then(function() {
        if (eventModel.get('errors.length') === 0) {
          App.lookup('controller:business.mainpage').openPopTip("正在保存");
          eventModel.save().then(function() {
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            if (_self.get("editMode")=="edit") {
              _self.set('detailEdit', false);
            } else {
              mainpageController.switchMainPage('customer-event');
              _self.set('detailEdit', false);
            }
          },function(err){
            let error = err.errors[0];
          });
        } else {
          eventModel.set("validFlag", Math.random());
        }
      });
    },
    deleteAction: function(leave) {
      var self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此事件", function() {
        App.lookup('controller:business.mainpage').openPopTip("正在删除");
        var eventModel = self.get("eventModel");
        eventModel.set("delStatus", 1);
        eventModel.save().then(
          function() {
            App.lookup('controller:business.mainpage').showPopTip("删除成功");
            App.lookup('route:business.mainpage.customer-event').refresh();
            App.lookup('controller:business.mainpage').switchMainPage('customer-event');
          }
        );
      });
    },
    editAction: function() {
      var status=this.get("eventModel.status");
      this.set("detailEdit", true);
    },
    //取消
    detailCancel: function() {
      if(this.get("editMode")=="edit"){
        this.set("detailEdit",false);
      }else {
          App.lookup('controller:business.mainpage').switchMainPage("customer-event");
      }
    },
    changeEventTime: function(date) {
      this.changeTime(date, "eventModel.eventTime");
    },
    eventTypeSelect: function(type) {
      this.set("eventModel.type", type);
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
