import Ember from 'ember';
import BaseController from './base-controller';

export default BaseController.extend({
  mainController: Ember.inject.controller('business.mainpage'),
  dateService: Ember.inject.service('date-service'),
  examiner:null,
  beginDate:null,
  endDate:null,
  employeeList:null,
  actions:{
    //页面跳转
    toDetailPage(assessment){
      let id=assessment.get('id');
      this.get("mainController").switchMainPage('assessment-detail',{id:id});
    },
    employeeChange:function(employee){
      this.set("examiner",employee);
      App.lookup("route:business.mainpage.assessment-manage").doQuery();
    },
    search: function(flag) {
      this.set("dateQueryCondition", flag);
      App.lookup("route:business.mainpage.assessment-manage").doQuery();
    },
    //时间选择器确定
    submmit:function(){
      this.set('dateShow', false);
      this.set("dateQueryCondition", 'flag');
      App.lookup("route:business.mainpage.assessment-manage").doQuery();
    },
    //清空时间
    emptied:function(){
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("dateQueryCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.assessment-manage").doQuery();
    },
    changeBeginDateAction:function(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("beginDate",date.getTime());
        this.set('showStartDate',stamp);
    },
    changeEndDateAction:function(date) {
        var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
        this.set("endDate",date.getTime());
        this.set('showEndDate',stamp);
    }
  },
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
  })
});
