import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service('date-service'),
  countWorkTime:1,
  employee:null,
  room:null,
  workTime:null,
  beginDate:null,
  endDate:null,
  employeeList:[],
  roomList:[],
  workTimeList:[],
  mainController: Ember.inject.controller('business.mainpage'),
  chooseDate:Ember.computed('showStartDate','showEndDate','dateQueryCondition',function(){
    if(this.get('dateQueryCondition')){
      let dateQueryCondition = this.get('dateQueryCondition');
      if(dateQueryCondition == 'today'){
        return '今天';
      }else if(dateQueryCondition == 'seven'){
        return '最近7天';
      }else if(dateQueryCondition == 'thirty'){
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
    search:function(condition){
        var self=this;
        var endDate=new Date().getTime();
        var beginDate;
        switch (condition) {
          case "today":
              beginDate=endDate;
            break;
          case "seven":
            beginDate=endDate-7*24*60*60*1000;
              break;
          case "thirty":
            beginDate=endDate-30*24*60*60*1000;
            break;
          case "emptied":
            beginDate=null;
            endDate=null;
            break;
          default:
        }
        self.set("beginDate",beginDate);
        self.set("endDate",endDate);
        App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    employeeChange:function(employee){
      this.set("employee",employee);
      App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    workTimeChange:function(workTimeSetting){
      this.set("workTime",workTimeSetting);
      App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    roomChange:function(room){
        this.set("room",room);
        App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    countWorkTimeChange:function(value){
      this.set("countWorkTime",parseInt(value));
      App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    //时间选择器确定
    submmit(){
      this.set('dateShow', false);
      this.set("dateQueryCondition", 'flag');
      App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    //清空时间
    emptied(){
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("dateQueryCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.person-location-report").doQuery();
    },
    changeBeginDateAction(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("beginDate",date.getTime());
        this.set('showStartDate',stamp);
    },
    changeEndDateAction(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("endDate",date.getTime());
        this.set('showEndDate',stamp);
    }
  }
});
