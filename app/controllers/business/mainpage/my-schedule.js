import Ember from 'ember';
import InfiniteScroll from '../../infinite-scroll';

export default Ember.Controller.extend(InfiniteScroll,{
  feedService: Ember.inject.service('feed-bus'),
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  infiniteContentPropertyName: "scheduleItemArraylist",
  infiniteModelName: "staffschedule",
  infiniteContainerName:"staffscheduleContainer",
  queryFlag:0,

  scrollObs: function () {//观察 infinite-scroll 设置的对象 _scroller
    var scroll = this.get("_scroller");
    if(!scroll){return;}
    var scrollId = "schedule_" + this.get("theDay");
    Ember.run.schedule("afterRender",this,function() {
      var toTop = $("#"+scrollId).offset().top;
      console.log("scroll111 top",toTop);
      console.log("scroll111 offset",$("#"+scrollId).offset());
      // scroll.scrollToElement(scrollId,600);//这个不能用了
      scroll.scrollTo(0,toTop*-1+55,600);
    });
  }.observes("_scroller"),
  queryObs: function(){
    //取得系统时间
    this.set("lookMonthSchedule","查看下月");
    this.set("nextMonthFlag",true);
    let sysTime = this.get("dataLoader").getNowTime();
    if(sysTime){
      sysTime = sysTime ;
    }else {
      sysTime = new Date().getTime()/1000;
    }
    var date = this.get("dateService").timestampToTime(sysTime);
    var theDay = date.getDate();//今天是几号
    this.set("theDay",theDay);
    var curMonth = date.getMonth();//今天是几月
    var year = date.getFullYear();//当前是几几年
    var month = curMonth + 1;
    date.setMonth(curMonth + 1);
    date.setDate(0);
    var monthHasDays = date.getDate();//当前月有多少天
    console.log("date1111111 theDay",theDay);
    console.log("date1111111 monthHasDays",monthHasDays);
    this.scheduleMonth(monthHasDays,month,year,theDay);
  }.observes("queryFlag").on("init"),
  queryFlagIn(){
    this.incrementProperty("queryFlag");
    this.set("scheduleFlag",false);//flag set为false
  },

  scheduleWorkListObs:function(){//排班休息 工作天数
    var scheduleFlag = this.get("scheduleFlag");
    if(!scheduleFlag){return;}
    var scheduleItemArray = this.get("scheduleItemArray");//这个月的工作表
    var workDays = 0 ;
    var restDays = 0 ;
    scheduleItemArray.forEach(function(item){
      if(item.get("type")==2){
        workDays = workDays + 1;
      }else {
        restDays = restDays + 1;
      }
    });
    this.set("workDays",workDays);
    this.set("restDays",restDays);
    // var scroll = new IScroll('#staffscheduleContainer', { mouseWheel: true });
    // var scrollId = "#schedule_" + this.get("theDay");
    // scroll.scrollToElement(scrollId,600);
  }.observes("scheduleFlag").on("init"),

  scheduleMonth:function(monthHasDays,curMonth,curYear,theDay){
    var _self = this;
    var monthArray = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
    var weekArray = ["周日","周一","周二","周三","周四","周五","周六"];
    var month ;
    curMonth < 10 ? month = '0'+ curMonth: month = curMonth ;
    this.set("month",month);
    this.set("theMonth",monthArray[curMonth-1]);
    _self.set("hasScheduleFlag",false);
    var curUser = this.get('global_curStatus').getUser();
    var employee = curUser.get("employee");
    var createScheduleItem = function(){
      let scheduleItem = Ember.Object.extend({
      });
      return scheduleItem.create();
    };
    let scheduleItemArray = new Ember.A();
    this.set("scheduleItemArray",scheduleItemArray);
    var weekDay = '';
    for (var i = 1; i <= monthHasDays; i++) {
      var j;
      i < 10 ? j = '0'+ i: j = i ;
      var dayDate = Date.parse(curYear+'/'+curMonth+'/'+i)/1000;//天数的描述时间戳
      var weekTab = this.get("dateService").timestampToTime(dayDate).getDay();
      var specItem ;
      if(i==theDay){
        specItem = Ember.Object.create({type:1,id:"schedule_"+i,day:i,dayStr:j,schedule:"未排班",weekDay:'今天'});
      }else {
        specItem = Ember.Object.create({type:1,id:"schedule_"+i,day:i,dayStr:j,schedule:"未排班",weekDay:weekArray[weekTab]});
      }

      scheduleItemArray.pushObject(specItem);
    }
    //查询出计时服务项目
    this.store.query("staffschedule",{filter:{employee:{id:employee.get("id")},month:curMonth,year:curYear}}).then(function(itemList){
      console.log("scheduleItemArray111 itemList1111",itemList);
      var index = 0;
      if(itemList && itemList.get("length")){
        // var itemListLength = itemList.get("length");//模式变了不是一天就一个排班了
        // _self.set("workDays",itemListLength);
        // _self.set("restDays",monthHasDays - itemListLength);

        scheduleItemArray.forEach(function(scheduleItem){
          var hasSchedule = new Ember.A();
          itemList.forEach(function(item){
            if(item.get("day")==scheduleItem.get("day")){
              hasSchedule.pushObject(item);//可能一天有好几个排班
              scheduleItem.set("items",hasSchedule);
              scheduleItem.set("type",2);
            }
          });
          index++;
          if(index >= scheduleItemArray.get("length")){
            _self.set("scheduleFlag",true);
          }
        });
      }else {
        _self.set("hasScheduleFlag",true);//该月没有排班的标示。
        console.log("hasScheduleFlag",scheduleItemArray);
        return;
      }

      console.log("scheduleItemArray111 query",scheduleItemArray);
    });
  },
  actions:{
    lookSchedule:function(){
      $("a.schedule_A").addClass("tapped");
      var nextMonthFlag = this.get("nextMonthFlag");
      let sysTime = this.get("dataLoader").getNowTime();
      if(sysTime){
        sysTime = sysTime ;
      }else {
        sysTime = new Date().getTime()/1000;
      }
      var date = this.get("dateService").timestampToTime(sysTime);
      var theDay = date.getDate();//今天是几号
      var curMonth = date.getMonth();//今天是几月
      var year = date.getFullYear();//几几年
      var month = curMonth + 1;//当前的月 下一个月所以加一
      var monthHasDays;
      var nextMonth;
      if(nextMonthFlag){
        nextMonth = month +1;
        date.setMonth(nextMonth);
        date.setDate(0);
        monthHasDays = date.getDate();//当前月有多少天
        this.set("lookMonthSchedule","返回本月");
      }else {
        nextMonth = month ;
        date.setMonth(nextMonth);
        date.setDate(0);
        monthHasDays = date.getDate();//当前月有多少天
        this.set("lookMonthSchedule","查看下月");
      }
      console.log("nextMonthFlag",nextMonthFlag);
      console.log("nextMonthFlag nextMonth",nextMonth);
      this.set("nextMonthFlag",(!nextMonthFlag));
      this.scheduleMonth(monthHasDays,nextMonth,year,theDay);
    },
  },

});
