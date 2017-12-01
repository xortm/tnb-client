import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service("date-service"),
  constants: Constants,
  queryCondition:'',
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
    //跳转详情页
    toDetailPage(servicecheck){
        let id=servicecheck.get('id');
        this.get("mainController").switchMainPage('service-check-detail',{id:id});//详情页
    },
    search(flag){
      this.set("timeCondition", flag);
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.service-check-management").doQuery();
    },
    //时间选择器确定
    submmit(){
      this.set('dateShow', false);
      this.set("timeCondition", 'flag');
      App.lookup("route:business.mainpage.service-check-management").doQuery();
    },
    //清空时间
    emptied(){
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("timeCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.service-check-management").doQuery();
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
    dpShowAction(e){

    },
  }
});
