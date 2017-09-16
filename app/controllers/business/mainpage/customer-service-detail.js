import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  showType: "scheduler",
  showTypeStr: Ember.computed("showType","btnGroupData",function(){
    var showType = this.get("showType");
    if(showType==="scheduler"){
      return "查看计划";
    }
    return "查看执行情况";
  }),
  schedulerName: "timelineDay",
  excutionName:"agendaDay",
  //查看类型按钮组
  btnGroupData:Ember.computed(function(){
    var a = new Ember.A();
    var oriArray = [{
      code:"scheduler",
      icon: "fa-clock-o",
      selected: true,
      text:"查看计划"
    },{
      code:"excution",
      selected: false,
      icon: "fa-sitemap",
      text:"查看执行情况"
    }];
    oriArray.forEach(function(item){
      var eo = Ember.Object.create(item);
      a.pushObject(eo);
    });
    return a;
  }),
  calendarGroupData:Ember.computed("showType",function(){
    var a = new Ember.A();
    var oriArray = null;
    if(this.get("showType")==="scheduler"){
      oriArray = [{
        code:"timelineDay",
        selected: true,
        text:"日计划"
      },{
        code:"timelineWeek",
        selected: false,
        text:"周计划"
      }];
    }else{
      oriArray = [{
        code:"agendaDay",
        selected: true,
        text:"日执行情况"
      },{
        code:"agendaWeek",
        selected: false,
        text:"周执行情况"
      }];
    }
    oriArray.forEach(function(item){
      var eo = Ember.Object.create(item);
      a.pushObject(eo);
    });
    return a;
  }),
  //日历控件设置
  fullCalendarConfig:Ember.computed("showType",function(){
    var config = {
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
        right: "agendaDay,agendaWeek"
      },
      allDayText: "全天",
      timeFormat: "H:mm",
      columnFormat: {
          month: 'dddd',
          week: 'dddd M-d',
          day: 'dddd M-d'
      },
    };
    if(this.get("showType")==="scheduler"){

    }else{
      // config.header = {
      //   left: "prev,next today",
      //   center:"title",
      //   right: "agendaDay,agendaWeek"
      // };
    }
    return config;
  }),
  //默认的服务列表
  serviceList:Ember.computed(function(){
    var a = new Ember.A();
    var oriArray = [{
      type: 1,
      code:"eat",
      selected: false,
      text:"喂食"
    },{
      type: 1,
      code:"bathe",
      selected: false,
      text:"洗澡"
    },{
      type: 1,
      code:"turn",
      selected: false,
      text:"翻身"
    },{
      type: 2,
      code:"massage",
      selected: false,
      text:"按摩"
    },{
      type: 2,
      code:"test",
      selected: false,
      text:"体检"
    }];
    oriArray.forEach(function(item){
      var eo = Ember.Object.create(item);
      a.pushObject(eo);
    });
    return a;
  }),
  //服务实施列表--日计划
  serviceApplyList:Ember.computed("serviceList",function(){
    var serviceList = this.get("serviceList");
    var copyList = function(){
      var list = new Ember.A();
      serviceList.forEach(function(item){
        var eo = Ember.Object.create(item);
        list.pushObject(eo);
      });
      return list;
    };
    var applyList = new Ember.A();
    //分成48份，每份都有一个服务实施列表
    for(var i=1;i<=48;i++){
      var start = this.getStartStrWithSeq(i);
      var end = this.getEndStrWithSeq(i);
      var obj = {seq:i,start:start,end:end,item:copyList(),count:0,type:"day"};
      var eo = Ember.Object.create(obj);
      applyList.pushObject(eo);
    }
    return applyList;
  }),
  //服务实施列表--周计划
  serviceApplyWeekList:Ember.computed("serviceList",function(){
    var serviceList = this.get("serviceList");
    var copyList = function(){
      var list = new Ember.A();
      serviceList.forEach(function(item){
        var eo = Ember.Object.create(item);
        list.pushObject(eo);
      });
      return list;
    };
    var applyList = new Ember.A();
    //分成7*48份，每份都有一个服务实施列表
    for(var j=1;j<=7;j++){
      for(var i=1;i<=48;i++){
        var start = this.getStartStrWithSeq(i,j);
        var end = this.getEndStrWithSeq(i,j);
        var obj = {seq:i*100+j,start:start,end:end,item:copyList(),count:0,type:"week"};
        var eo = Ember.Object.create(obj);
        applyList.pushObject(eo);
      }
    }
    return applyList;
  }),
  //选中的时间
  selectedTime:null,
  //选中的时间编号
  selectedTimeSeq:Ember.computed("selectedTime","viewName",function(){
    var selectedTime = this.get("selectedTime");
    //通过小时数字以及是否半点，决定时间编号
    var hours = selectedTime.hours();
    var minutes = selectedTime.minutes();
    var selectedTimeSeq = hours * 2;
    if(minutes===30){
      selectedTimeSeq = selectedTimeSeq + 1;
    }
    if(this.get("viewName")==="agendaDay"){
      return selectedTimeSeq;
    }
    //如果是周计划，则累乘天数
    if(this.get("viewName")==="agendaWeek"){
      var day = selectedTime.get("day");
      console.log("day no:" + day);
      return selectedTimeSeq + day*100;
    }
  }),
  //当前选中时间段的服务内容
  curApplyData: Ember.computed("serviceApplyList","selectedTimeSeq",function(){
    var data = this.get("serviceApplyList").findBy("seq",this.get("selectedTimeSeq"));
    return data.get("item");
  }),
  //当前各个时间段的已勾选服务内容
  curApplySectionData: Ember.computed("viewName","serviceApplyList.@each.count",function(){
    var events = new Ember.A();
    this.get("serviceApplyList").forEach(function(applyDef){
      console.log("applyDef is",applyDef);
      // var list = applyDef.get("item").filterBy("selected",true);
      applyDef.get("item").forEach(function(item){
        if(item.get("selected")){
          console.log("need push item",item);
          events.pushObject({
            id:applyDef.get("seq"),
            title:item.get("text"),
            start:applyDef.get("start"),
            end:applyDef.get("end"),
          });
        }
      });
    });
    console.log("events len",events.get("length"));
    return events;
  }),
  curApplySectionWeekData:[],
  //根据序号取得开始时间（moment-ish格式，)
  getStartStrWithSeq: function(seq,wq){
    var now = moment();
    var hour = seq/2;
    var minute = seq % 2 *30;
    console.log("comp hour:" + hour + " and minute:" + minute);
    now.set("hour",hour);
    now.set("minute",minute);
    if(wq){
      console.log("day of week:" + now.get("day"));
      now.set("day",wq);
      console.log("day of week after:" + now.get("day"));
    }
    return now.format();
  },
  //根据序号取得结束时间（moment-ish格式，)
  getEndStrWithSeq: function(seq,wq){
    seq = seq + 1;
    return this.getStartStrWithSeq(seq,wq);
  },
  actions:{
    switchAction(code){
      this.set("showType",code);
    },
    //日历选择
    calSelect(start, end, allDay){
      console.log("calSelect in,start",start);
      this.send("showItemSelectModal",start);
    },
    //日历控件加载后，进一步加工
    viewRender(view,element){
      console.log("viewRender in",view);
      this.set("viewName",view.name);
      //日历计划需要清空日期显示
      if(this.get("showType")==="scheduler"){
        if(view.name==="agendaDay"){
          //不显示当前是星期几
          element.find("table tr:first th:nth(1)").hide();
        }else{
          //不显示周中每天的具体日期
          element.find("table tr:first th").each(function(){
            var text = $(this).find("span").html();
            console.log("text ori:" + text);
            if(!text){
              return;
            }
            text = text.split(" ")[0];
            console.log("text rep:" + text);
            $(this).find("span").html(text);
          });
        }
      }
    },
    eventClick(event){
      console.log("eventClick in,event",event);
      this.send("calSelect",event.start,event.end,event.allDay);
    },
    //保存服务项目设置
    saveServiceItem(){
      this.send("hideItemSelectModal");
      var alist = this.get("serviceApplyList").findBy("seq",this.get("selectedTimeSeq"));
      var curData = this.get("curApplyData");
      console.log("alist get",alist);
      //保存到总的服务实施列表
      alist.set("item",this.get("curApplyData"));
      var count = alist.get("count") + 1;
      alist.set("count",count);
    },
    showItemSelectModal: function(start){
      var serviceDateStr = "";
      this.set("selectedTime",start);
      if(this.get("viewName")==="agendaDay"){
        serviceDateStr = start.format("LT");
        serviceDateStr = "护理项目日计划设置,时间：" + serviceDateStr;
      }else{
        serviceDateStr = start.format("dddd") + " " + start.format("LT");
        serviceDateStr = "护理项目周计划设置,时间：" + serviceDateStr;
      }
      this.set("serviceDateStr",serviceDateStr);
      this.set("showPopPasschangeModal",true);
    },
    hideItemSelectModal: function(){
      this.set("showPopPasschangeModal",false);
    },
  }
});
