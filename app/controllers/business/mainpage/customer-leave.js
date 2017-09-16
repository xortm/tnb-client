import Ember from 'ember';

export default Ember.Controller.extend({
  leaveList: [],
  showComplete: false,
  queryStr: null,
  selectLeave: null,
  inLeaving:false,
  mainController: Ember.inject.controller('business.mainpage'),
  dateService: Ember.inject.service("date-service"),
  chooseDate: Ember.computed('showStartDate', 'showEndDate', 'dateQueryCondition', function() {
    if (this.get('dateQueryCondition')) {
      let dateQueryCondition = this.get('dateQueryCondition');
      if (dateQueryCondition == 'today') {
        return '今天';
      } else if (dateQueryCondition == 'seven') {
        return '最近7天';
      } else if (dateQueryCondition == 'thirty') {
        return '最近30天';
      } else {
        if (this.get('showStartDate') && this.get('showEndDate')) {
          return this.get('showStartDate') + '至' + this.get('showEndDate');
        } else {
          return '选择日期';
        }
      }
    } else {
      return '选择日期';
    }
  }),
  actions: {
    toLeaving: function() {
      this.get("mainController").switchMainPage('customer-leave-leaving');
    },
    search: function(flag) {
      this.set("dateQueryCondition", flag);
      App.lookup("route:business.mainpage.customer-leave").doQuery();
    },
    deleteLeave: function(leave) {
      var self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录", function() {
        App.lookup('controller:business.mainpage').openPopTip("正在删除");
        leave.set("delStatus", 1);
        self.save(leave, "删除");
      });
    },
    completeLeave: function(leave) {
      this.set("selectLeave", leave);
      this.set("showComplete", true);
    },
    changeEndTime: function(date) {
      if (!date) {
        return;
      }
      var stamp = this.get("dateService").timeToTimestamp(date);
      this.set("selectLeave.endTime", stamp);
    },
    cancelCompleteLive:function(){
      this.set("showComplete", false);
      this.set("selectLeave", null);
    },
    toDetailPage: function(leave) {
      if (leave) {
        this.get("mainController").switchMainPage('customer-leave-detail', {
          "editMode": "edit",
          "id": leave.get("id")
        });
      } else {
        this.get("mainController").switchMainPage('customer-leave-detail', {
          "editMode": "add"
        });
      }
    },
    saveCompleteLive: function() {
      var self = this;
      var selectLeave = self.get("selectLeave");
      if(!selectLeave.get("endTime")){
        App.lookup('controller:business.mainpage').showAlert("销假日期不能为空");
        return;
      }
      App.lookup('controller:business.mainpage').showConfirm("销假后将无法修改,是否确定", function() {
        selectLeave.set("status", 2);
        App.lookup('controller:business.mainpage').openPopTip("销假中");
        selectLeave.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("销假成功");
          self.set("showComplete", false);
          self.set("selectLeave", null);
        });
      });
    },

    //时间选择器确定
    submmit() {
      this.set('dateShow', false);
      this.set("dateQueryCondition", 'flag');
      App.lookup("route:business.mainpage.customer-leave").doQuery();
    },
    //清空时间
    emptied() {
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("dateQueryCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.customer-leave").doQuery();
    },
    changeBeginDateAction(date) {
      var stamp = this.get("dateService").dateFormat(date, "yyyy-MM-dd");
      this.set("beginDate", date);
      this.set('showStartDate', stamp);
    },
    changeEndDateAction(date) {
      var stamp = this.get("dateService").dateFormat(date, "yyyy-MM-dd");
      this.set("endDate", date);
      this.set('showEndDate', stamp);
    },
    changeTab:function(inLeaving){
      this.set("inLeaving",inLeaving);
      App.lookup("route:business.mainpage.customer-leave").doQuery();
    }
  },
  save: function(leave, info) {
    leave.save().then(function() {
      App.lookup('controller:business.mainpage').showPopTip(info + "成功");
      var route = App.lookup('route:business.mainpage.customer-leave');
      App.lookup('controller:business.mainpage').refreshPage(route);
    });
  },
});
