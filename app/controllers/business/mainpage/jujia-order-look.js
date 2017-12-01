import Ember from 'ember';

export default Ember.Controller.extend({
  nursingplandetailList: [],
  queryStr: null,
  selectTypecode:"all",
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
    selectEmployee(employee){
      this.set('defaultEmployee',employee);
      App.lookup("route:business.mainpage.jujia-order-look").doQuery();
    },
    search: function(flag) {
      this.set("dateQueryCondition", flag);
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.jujia-order-look").doQuery();
    },
    toDetailPage: function(nursingplandetail) {
      console.log("serviceOperater:",nursingplandetail.get("serviceOperater"));
      console.log("serviceOperater length:",nursingplandetail.get("serviceOperater").get("length"));
      if (!nursingplandetail.get("serviceOperater.id")) {
        this.get("mainController").switchMainPage('jujia-order-detail', {
          "editMode": "edit",
          "id": nursingplandetail.get("id")
        });
      } else {
        this.get("mainController").switchMainPage('jujia-order-detail', {
          "editMode": "look",
          "id": nursingplandetail.get("id")
        });
      }
    },
    //时间选择器确定
    submmit() {
      this.set('dateShow', false);
      this.set("dateQueryCondition", 'flag');
      App.lookup("route:business.mainpage.jujia-order-look").doQuery();
    },
    //清空时间
    emptied() {
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("dateQueryCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.jujia-order-look").doQuery();
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
    changeTab:function(selectTypecode){
      this.set("selectTypecode",selectTypecode);
      App.lookup("route:business.mainpage.jujia-order-look").doQuery();
    }
  },

});
