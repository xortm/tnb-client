import Ember from 'ember';
import BaseItem from '../ui/base-ui-item'

export default BaseItem.extend({
  showType: "byTime",
  showTypeStr: Ember.computed("showType","btnGroupData",function(){
    var showType = this.get("showType");
    if(showType==="byItem"){
      return "按项目查看";
    }
    return "按时间查看"
  }),
  viewName: "timelineDay",
  btnGroupData:Ember.computed(function(){
    var a = new Ember.A();
    var oriArray = [{
      code:"byTime",
      icon: "fa-clock-o",
      selected: true,
      text:"按时间查看"
    },{
      code:"byItem",
      selected: false,
      icon: "fa-sitemap",
      text:"按项目查看"
    }];
    oriArray.forEach(function(item){
      var eo = Ember.Object.create(item);
      a.pushObject(eo);
    });
    return a;
  }),
  calendarGroupData:Ember.computed(function(){
    var a = new Ember.A();
    var oriArray = [{
      code:"timelineDay",
      selected: true,
      text:"日计划"
    },{
      code:"timelineWeek",
      selected: false,
      text:"周计划"
    }];
    oriArray.forEach(function(item){
      var eo = Ember.Object.create(item);
      a.pushObject(eo);
    });
    return a;
  }),
  fullCalendarConfig:{
    buttonText:{
      week: '周视图',
      day: '日视图'
    },
    titleFormat:{
      month: 'yyyy年 MMMM月',
      week: "[yyyy年] MMMM月d日 { '&#8212;' [yyyy年] MMMM月d日}",
      day: 'yyyy年 MMMM月d日 dddd'
    },
    monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
    dayNames: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
    header: {
      left: false,
      center:false,
      right: "timelineDay,timelineWeek"
    },
    allDayText: "全天",
    timeFormat: "H:mm",
    columnFormat: {
        month: 'dddd',
        week: 'dddd M-d',
        day: 'dddd M-d'
    },
  },
  actions:{
    switchAction(code){
      this.set("showType",code);
    },
    switchCalendar(code){
      this.set('viewName', code);
    },
    //日历选择
    calClick(event, jsEvent, view){
      console.log("calClick in");
      this.send("showItemSelectModal");
    },
    hideItemSelectModal(){
      this.set("showPopPasschangeModal",false);
    },
    showItemSelectModal(){
      this.set("showPopPasschangeModal",true);
    }
  }
});
