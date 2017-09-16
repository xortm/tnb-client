import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
export default Ember.Component.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  durTypeFlag:'',
  beginseaconFlag:'',
  endseaconFlag:'',
  today: Ember.computed(function() {
      let today = this.get('dateService').getCurrentTime();
      today=parseInt(today)-86400;
      today = this.get("dateService").timestampToTime(today);
      console.log('today is:',today);
      return today;
  }),
  didInsertElement:function(){
    // var durTypeFlag='';
    // this.set('durTypeFlag',durTypeFlag);
    this.set('intervalShow',false);
  },
  actions:{
    yearClick:function(year){
      if(year){
         this.set('durTypeFlag',year);
         this.set('yearShow',true);
         this.set('seasonShow',false);
         this.set('mouthShow',false);
         this.set('dayShow',false);
         this.set('intervalShow',true);
      }
    },
    seasonClick:function(season){
      if(season){
        this.set('durTypeFlag',season);
        this.set('yearShow',false);
        this.set('seasonShow',true);
        this.set('mouthShow',false);
        this.set('dayShow',false);
         this.set('intervalShow',true);
      }
    },
    mouthClick:function(mouth){
      if(mouth){
        this.set('durTypeFlag',mouth);
        this.set('yearShow',false);
        this.set('seasonShow',false);
        this.set('mouthShow',true);
        this.set('dayShow',false);
        this.set('intervalShow',true);
      }
    },
  dayClick:function(day){
      if(day){
        this.set('durTypeFlag',day);
        this.set('yearShow',false);
        this.set('seasonShow',false);
        this.set('mouthShow',false);
        this.set('dayShow',true);
         this.set('intervalShow',true);
      }
    },
    changeBeginDateAction(date) {
      var stamp=null;
      var curDate=null;
      if(this.get('durTypeFlag')=='year'){
         stamp=this.get("dateService").dateFormat(date,"yyyy");
         stamp=stamp+'年';
         var params1=parseInt(date.getFullYear());//年份
         console.log('time-interval:params1',params1);
         curDate=this.get("dateService").getFirstSecondStampOfYear(params1);
         console.log('durTypeFlag==year',curDate);
      }
      if(this.get('durTypeFlag')=='mouth'){
        //stamp=this.get("dateService").dateFormat(date,"yyyy-MM");
        var params2=parseInt(date.getFullYear());//年份
        console.log('durTypeFlag==mouth-params2',params2);
        var params3=parseInt(date.getMonth() + 1);//月份
        console.log('durTypeFlag==mouth-params3',params3);
        curDate=this.get("dateService").getFirstSecondStampOfMonth(params2,params3);
        console.log('durTypeFlag==mouth',curDate);
        stamp=params2+'年'+params3+'月';
      }
      if(this.get('durTypeFlag')=='day'){
        console.log('durTypeFlag==day:date',date);
         stamp=this.get("dateService").formatDateString(date);
         curDate=this.get("dateService").getFirstSecondStampOfDay(date);
         console.log('durTypeFlag==day',curDate);
      }

        this.set("beginDate",curDate);
        this.set('showStartDate',stamp);
        this.set("beginseaconDate",'');
        this.set("endseaconDate",'');
        this.set('showBeginSeaconDate','');
        this.set('showEndSeaconDate','');
    },
    changeEndDateAction(date) {
      var stamp=null;
      var curDate=null;
      if(this.get('durTypeFlag')=='year'){
         stamp=this.get("dateService").dateFormat(date,"yyyy");
         stamp=stamp+'年';
         var params1=parseInt(date.getFullYear());//年份
         curDate=this.get("dateService").getLastSecondStampOfYear(params1);
         console.log('结束年份是',curDate);
      }
      if(this.get('durTypeFlag')=='mouth'){
        //stamp=this.get("dateService").dateFormat(date,"yyyy-MM");
        var params2=parseInt(date.getFullYear());//年份
        var params3=parseInt(date.getMonth() + 1);//月份
        curDate=this.get("dateService").getLastSecondStampOfMonth(params2,params3);
        stamp=params2+'年'+params3+'月';
      }
      if(this.get('durTypeFlag')=='day'){
         stamp=this.get("dateService").formatDateString(date);
         curDate=this.get("dateService").getLastSecondStampOfDay(date);
         console.log('day:curDate is',curDate);
      }
        this.set("endDate",curDate);
        this.set('showEndDate',stamp);
        this.set("beginseaconDate",'');
        this.set("endseaconDate",'');
        this.set('showBeginSeaconDate','');
        this.set('showEndSeaconDate','');
    },
    changeBeginSeaconDateAction(date) {//季度开始年份
        //var curDate=null;
        var stamp=this.get("dateService").dateFormat(date,"yyyy");
        stamp=stamp+'年';
        this.set("beginseaconDate",date);
        this.set('showBeginSeaconDate',stamp);
        this.set("beginDate",'');
        this.set('showStartDate','');
        this.set("endDate",'');
        this.set('showEndDate','');
    },
    changeEndSeaconDateAction(date) {//季度结束年份
        var stamp=this.get("dateService").dateFormat(date,"yyyy");
        stamp=stamp+'年';
        this.set("endseaconDate",date);
        this.set('showEndSeaconDate',stamp);
        this.set("beginDate",'');
        this.set('showStartDate','');
        this.set("endDate",'');
        this.set('showEndDate','');
    },
    dpShowAction(e){

    },
    //显示时间选择器
    showDate() {
        this.get("controller").set('dateShow', true);
        this.set('intervalShow',false);
    },
    //隐藏时间选择器
    hideDate() {
        this.get("controller").set('dateShow', false);
    },
    submmit() {
      this.get("controller").set('dateShow', false);
      this.set('yearShow',false);
      this.set('seasonShow',false);
      this.set('mouthShow',false);
      this.set('dayShow',false);
      var durTypeFlag=this.get('durTypeFlag');
      console.log('durTypeFlag is seacon?',durTypeFlag);
      var beginseaconFlag=this.get('beginseaconFlag');
      var endseaconFlag=this.get('endseaconFlag');
      var showStartDate=this.get('showStartDate');
      var showEndDate=this.get('showEndDate');
      var beginDate=this.get('beginDate');
      var endDate=this.get('endDate');
      var showBeginSeaconDate=this.get('showBeginSeaconDate');
      var beginseaconDate=this.get('beginseaconDate');
      var endseaconDate=this.get('endseaconDate');
      var showEndSeaconDate=this.get('showEndSeaconDate');
      this.sendAction('submmit',durTypeFlag,beginseaconFlag,endseaconFlag,showStartDate,showEndDate,beginDate,endDate,showBeginSeaconDate,beginseaconDate,endseaconDate,showEndSeaconDate);
    },
    oneSeacon(one){
      console.log('oneSeacon:one',one);
        this.set('beginseaconFlag',one);
    },
    secondSeacon(second){
      this.set('beginseaconFlag',second);
    },
    thirdSeacon(third){
      this.set('beginseaconFlag',third);
    },
    fourSeacon(four){
      this.set('beginseaconFlag',four);
    },
    endoneSeacon(endone){
      this.set('endseaconFlag',endone);
    },
    endsecondSeacon(endsecond){
      this.set('endseaconFlag',endsecond);
    },
    endthirdSeacon(endthird){
      this.set('endseaconFlag',endthird);
    },
    endfourSeacon(endfour){
      this.set('endseaconFlag',endfour);
    },
  }
});
