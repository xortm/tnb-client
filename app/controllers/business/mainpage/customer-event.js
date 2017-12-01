import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service('date-service'),
  employee:null,
  room:null,
  beginDate:null,
  endDate:null,
  employeeList:[],
  roomList:[],
  mainController: Ember.inject.controller('business.mainpage'),
  chooseDate:Ember.computed('showStartDate','showEndDate','timeCondition',function(){
    if(this.get('timeCondition')){
      let timeCondition = this.get('timeCondition');
      if(timeCondition == 'today'){
        return '今天';
      }else if(timeCondition == 'seven'){
        return '最近7天';
      }else if(timeCondition == 'thirty'){
        return '最近30天';
      }else{
        if(this.get('showStartDate')&&this.get('showEndDate')){
          return this.get('showStartDate')+'至'+this.get('showEndDate');
        }else{
          return '选择日期';
        }
      }
    }else{
      return '选择日期';
    }
  }),
  actions:{
    search:function(flag){
      this.set("timeCondition", flag);
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.customer-event").doQuery();
    },
    // employeeChange:function(employee){
    //   this.set("employee",employee);
    //   App.lookup("route:business.mainpage.customer-event").doQuery();
    // },
    // roomChange:function(room){
    //     this.set("room",room);
    //     App.lookup("route:business.mainpage.customer-event").doQuery();
    // },
    //时间选择器确定
    submmit(){
      this.set('dateShow', false);
      this.set("timeCondition", 'flag');
      App.lookup("route:business.mainpage.customer-event").doQuery();
    },
    //清空时间
    emptied(){
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("timeCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.customer-event").doQuery();
    },
    changeBeginDateAction(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("beginDate",date);
        this.set('showStartDate',stamp);
    },
    changeEndDateAction(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("endDate",date);
        this.set('showEndDate',stamp);
    },
    selectCustomer(customer){
      if(customer){
        this.set('customer',customer);
        this.set('customerId',customer.get('id'));
      }else {
        this.set('customer',null);
        this.set('customerId',null);
      }
      App.lookup("route:business.mainpage.customer-event").doQuery();
    },
    toDetailPage : function(event){
      var param=event?{id:event.get("id"),editMode:"edit"}:{editMode:"add"};
      this.get("mainController").switchMainPage('customer-event-detail', param);
    }
  }
});
