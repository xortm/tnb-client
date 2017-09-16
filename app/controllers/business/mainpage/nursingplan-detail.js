import Ember from 'ember';
import Changeset from 'ember-changeset';
import planValidations from '../../../validations/plan';
import lookupValidator from 'ember-changeset-validations';

export default Ember.Controller.extend(planValidations,{
  global_dataLoader: Ember.inject.service('data-loader'),
  dateService: Ember.inject.service("date-service"),
  constants: Constants,
  queryCondition:'',
  planModel:Ember.computed('planInfo',function(){
    var model = this.get("planInfo");
    if (!model) {
        return null;
    }
    return new Changeset(model, lookupValidator(planValidations), planValidations);
  }),
  detailEdit:false,

  //日历控件开始
  showType: "scheduler",
  showTypeStr: Ember.computed("showType","btnGroupData",function(){
    var showType = this.get("showType");
    if(showType==="scheduler"){
      return "查看计划";
    }
    return "查看执行情况";
  }),
  schedulerName: "timelineDay",
  excutionName:"agendaWeek",
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
      oriArray = [
        {
        code:"timelineDay",
        selected: false,
        text:"日计划"
      },
      {
        code:"agendaWeek",
        selected: true,
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
      events:[
        {allDay:false}
      ],
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
        right: false
      },
      slotLabelFormat:"HH:mm",
      timeFormat: "HH:mm",
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
  serviceList:Ember.computed('projectServices',function(){
    var a = new Ember.A();
    let serArr=this.get('projectServices');
    if(serArr){

      serArr.forEach(function(ser){
        if(ser.get('period.id')){
          let type;
          if(ser.get('period.id')==145){
            type=2;
          }else if(ser.get('period.id')==144){
            type=1;
          }
          let num;
          if(ser.get('frequency')){
            num = ser.get('frequency');
          }else{
            num = 0;
          }
          let eo=Ember.Object.create({
            type:type,
            code:ser.get('id'),
            selected:false,
            number:num,
            text:ser.get('item.name'),
          });
          if(type==2){
            eo.set('color',true);
          }
          a.pushObject(eo);
        }

      });
    }
    return a;
  }),
  //已有项目计划列表
  hasServiceList:Ember.computed('hasServices',function(){
    let a = new Ember.A();
    let serArr = this.get('hasServices');
    if(serArr){
      serArr.forEach(function(ser){
        let type;
        if(ser.get('period.typename')=='周'){
          type=2;
        }else{
          type=1;
        }
        let eo=Ember.Object.create({
          hourOfDay:ser.get('startTimeTab'),
          dayOfWeek:ser.get('weekTab'),
          type:type,
          code:ser.get('id'),
          item:ser.get('item'),
          selected:true,
          text:ser.get('item.item.name'),
        });
        a.pushObject(eo);
      });
    }
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
  serviceApplyWeekList:Ember.computed("serviceList","hasServiceList",function(){
    var serviceList = this.get("serviceList");
    let count = 0;
    var copyList = function(){
      var list = new Ember.A();
      serviceList.forEach(function(item){
        var eo = Ember.Object.create(item);
        list.pushObject(eo);
      });
      return list;
    };
    let hasServiceList = this.get('hasServiceList');

    var applyList = new Ember.A();
    //分成7*48份，每份都有一个服务实施列表
    for(var j=1;j<=7;j++){
      for(var i=1;i<=48;i++){
        var start = this.getStartStrWithSeq(i,j);
        var end = this.getEndStrWithSeq(i,j);
        var obj = {
          dayOfWeek:j,
          hourOfDay:i,
          seq:j*100+i,
          start:start,
          end:end,
          item:copyList(),
          count:0,
          type:"week",
        };

        var eo = Ember.Object.create(obj);
        applyList.pushObject(eo);
      }
    }
      //匹配已有的项目计划
      hasServiceList.forEach(function(service){
        applyList.forEach(function(apply){
          if(apply.get('dayOfWeek')==service.get('dayOfWeek')&&apply.get('hourOfDay')==service.get('hourOfDay')){
            let item = apply.get("item");
            item.forEach(function(itemService){
              console.log('itemService:',itemService);
              if(service.get("item.id")===itemService.get("code")){

                if(itemService.get('type')==2){
                  let weekService = serviceList.findBy('code',itemService.get("code"));
                  weekService.set('number',weekService.get('number')-1);
                }
                if((itemService.get('type')==1)){
                  count++;
                  if(count%7===0){
                    let weekService = serviceList.findBy('code',itemService.get("code"));
                    weekService.set('number',weekService.get('number')-1);
                  }

                }

                itemService.set('selected',true);
              }
            });

          }
      });
    });
    return applyList;
  }),
  //选中的时间
  selectedTime:null,
  //根据日期序号（星期）和小时号生成序号
  buildSeq: function(daySeq,hourSeq){
    return daySeq*100 + hourSeq;
  },
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
      //周日序号改为7
      if(day===0){
        day = 7;
      }
      // console.log("day no:" + day);
      return selectedTimeSeq + day*100;
    }
  }),

  //当前选中时间段的服务内容
  curApplyData: Ember.computed("serviceApplyWeekList","selectedTimeSeq",function(){
    let seq=this.get("selectedTimeSeq");
    var data = this.get("serviceApplyWeekList").findBy("seq",seq);
    return data.get("item");
  }),
  //当前各个时间段的已勾选服务内容
  curApplySectionData: Ember.computed("flag","viewName","serviceApplyWeekList.@each.count",function(){
    var events = new Ember.A();
    this.get("serviceApplyWeekList").forEach(function(applyDef){
      // console.log("applyDef is",applyDef);
      // var list = applyDef.get("item").filterBy("selected",true);

        applyDef.get("item").forEach(function(item){
          if(item.get("selected")){
            console.log("need push item",item);
            let event = {
              id:applyDef.get("seq"),
              code:item.get("code"),
              title:item.get("text"),
              dayOfWeek:applyDef.get("dayOfWeek"),
              hourOfDay:applyDef.get("hourOfDay"),
              start:applyDef.get("start"),
              end:applyDef.get("end"),
            };
            if(item.get('type')==2){
              event.color = '#A8BC7B';
            }
            events.pushObject(event);
            console.log('events:',events,item.get('type'));
          }
        });



    });
    console.log("events len",events.get("length"));
    if(events.get('length')!==0){
      let event=events.get('firstObject');
    }
    return events;
  }),
  curApplySectionWeekData:[],
  //根据序号取得开始时间（moment-ish格式，)
  getStartStrWithSeq: function(seq,wq){
    var now = moment();
    var hour = seq/2;
    var minute = seq % 2 *30;
    now.set("hour",hour);
    now.set("minute",minute);
    if(wq){
      now.set("day",wq);
    }
    return now.format();
  },
  //根据序号取得结束时间（moment-ish格式，)
  getEndStrWithSeq: function(seq,wq){
    seq = seq + 1;
    return this.getStartStrWithSeq(seq,wq);
  },

  //日历控件结束
  actions:{
    dpShowAction(e){},
    //选择开始时间
    changePlanStartDateAction(date){
      var stamp = this.get("dateService").getLastSecondStampOfDay(date);
      this.set("planModel.planStartTime", stamp);
    },
    // //选择结束时间
    // changePlanEndDateAction(date){
    //     var stamp = this.get("dateService").getLastSecondStampOfDay(date);
    //     this.set("planModel.planEndTime", stamp);
    // },
    //保存
    detailSaveClick(){
      let _self = this;
      var editMode = this.get('editMode');
      var planModel = this.get('planModel');
      let servArr = [];
      var count = 0;
      let curApplySectionData = this.get('curApplySectionData');//当前已选的所有项目
      console.log('当前选择项目：',this.get('curApplySectionData'));
      curApplySectionData.forEach(function(curSectionDate){
        let item = _self.store.peekRecord('nursingprojectitem',curSectionDate.code);
        let startTime =curSectionDate.hourOfDay;
        // let service=_self.store.createRecord('nursingplanitem',{});
        let service={};
        service.startTimeTab = startTime;
        service.item = item.get('id');
        service.plan = _self.get('planInfo.id');
        service.weekTab = curSectionDate.dayOfWeek;
        servArr = servArr.concat(service);
      });
      if(servArr.length===0){
        let service={};
        service.plan = _self.get('planInfo.id');
        service.item = '';
        servArr = servArr.concat(service);
      }

      //将护理项目保存为json
      let serviceJson = JSON.stringify(servArr);
      let serviceJsonModel = this.store.createRecord('jsonmodel',{});
      serviceJsonModel.set('jsonData',serviceJson);
      serviceJsonModel.set('type','nursingplanitem');
      serviceJsonModel.save();

        planModel.validate().then(function(){
          if(planModel.get('errors.length')===0){
            App.lookup('controller:business.mainpage').openPopTip("正在保存");
            if(editMode=='add'){
              planModel.set('delStatus',0);
              planModel.save().then(function(){
                App.lookup('controller:business.mainpage').showPopTip("保存成功");
                var mainpageController = App.lookup('controller:business.mainpage');
                mainpageController.switchMainPage('nursing-plan');
              });
            }else{
                planModel.save().then(function(){
                  App.lookup('controller:business.mainpage').showPopTip("保存成功");
                  _self.set('detailEdit',false);
                  var route=App.lookup('route:business.mainpage.nursingplan-detail');
                  App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
                });
              }
          }else{
            planModel.set("validFlag",Math.random());
          }
        });


    },
    invalid(){},
    detailEditClick:function(){
      let _self=this;
      this.set('detailEdit',true);
      Ember.run.schedule("afterRender",this,function() {
        //设置拖拽
        console.log("external-event",$.find("#event-box .external-event"));
        $.find("#event-box .external-event").forEach(function (target) {
          _self.initDrag($(target));
          console.log('target:',target);
        });
      });
    },//编辑按钮
    detailCancel:function(){
      var id=this.get('id');
      var editMode=this.get('editMode');
      if(id&&editMode=='edit'){
        this.set('detailEdit',false);
        this.get('planInfo').rollbackAttributes();
        var route=App.lookup('route:business.mainpage.nursingplan-detail');
        App.lookup('controller:business.mainpage').refreshPage(route);//刷新页面
      }else{
        this.get('planInfo').rollbackAttributes();
        let mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('nursing-plan');
      }
    },//取消按钮
    //删除按钮
    delById(){
      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否确定删除此记录",function(){
        _self.send('cancelPassSubmit',_self.get('planInfo'));
      });
    },
    unis(service){
      let _self = this;
      if(this.get('detailEdit')){
        App.lookup('controller:business.mainpage').showConfirm("是否重置该项目",function(){
          _self.send('reset',service);
        });
      }

    },
    //重置
    reset(service){
      let _self = this;
      let count = 0;
      let serviceList = this.get('serviceList');
      let curApplySectionData = this.get('curApplySectionData');
      let delServices = new Ember.A();
      curApplySectionData.forEach(function(serv){
        if(serv.code==service.get('code')){
          delServices.pushObject(serv);
          var alist = _self.get("serviceApplyWeekList").findBy("seq",serv.id);
          var serviceItem = alist.get("item").findBy("code",serv.code);
          serviceItem.set("selected",false);
          count++;
          if(count%7===0){
            let weekService = serviceList.findBy('code',service.get("code"));
            weekService.set('number',weekService.get('number')+1);
          }
        }
      });
      curApplySectionData.removeObjects(delServices);
      this.incrementProperty('flag');
    },
    //弹窗取消
    invitation(){
      this.set('showpopInvitePassModal',false);
    },
    //删除记录
    cancelPassSubmit(planInfo){
      App.lookup('controller:business.mainpage').openPopTip("正在删除");
			this.set("showpopInvitePassModal",false);
      planInfo.set("delStatus", 1);
      planInfo.save().then(function() {
          App.lookup('controller:business.mainpage').showPopTip("删除成功");
          var mainpageController = App.lookup('controller:business.mainpage');
          mainpageController.switchMainPage('nursing-plan');
      });
    },
    /////////////////日历控件方法开始
    //日历选择
    calSelect(start, end, allDay){
      // console.log("calSelect in,start",start);
      // console.log("calSelect in,end",end);
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
    changeServiceItem(){
      this.send("hideItemSelectModal");
      let seq=this.get("selectedTimeSeq");
      var alist = this.get("serviceApplyWeekList").findBy("seq",seq);
      var curData = this.get("curApplyData");
      // console.log("alist get",alist);
      //保存到总的服务实施列表
      alist.set("item",this.get("curApplyData"));
      this.send("servicePlanChange",alist);
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
    //从外面拖进来以后触发
    dropAction: function(date) { // this function is called when something is dropped
      var originalEventObject = this.get("currentDragObj");
      this.send("pushServiceEventToApplyList",date,originalEventObject);
      // is the "remove after drop" checkbox checked?
      if ($('#drop-remove').is(':checked')) {
        // if so, remove the element from the "Draggable Events" list
        $(this).remove();
      }
    },
    dragStartAction: function(event) {
      // console.log("dragStartAction event",event);
    },
    //表格内拖动以后触发
    dragStopAction: function(event, jsEvent) {
      //判断是否删除，并进行处理
      var trashEl = jQuery('#calendarTrash');
      var ofs = trashEl.offset();
      var x1 = ofs.left;
      var x2 = ofs.left + trashEl.outerWidth(true);
      var y1 = ofs.top;
      var y2 = ofs.top + trashEl.outerHeight(true);
      if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
        jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
          //删除选中事件
          $('#scheCalendar').fullCalendar('removeEvents', event.id);
          //删除实际的数据
          var alist = this.get("serviceApplyWeekList").findBy("seq",event.id);
          var serviceItem = alist.get("item").findBy("code",event.code);
          serviceItem.set("selected",false);
          let curApplySectionData = this.get('curApplySectionData');
          let service = curApplySectionData.findBy('id',event.id);
          curApplySectionData.removeObject(service);
          console.log('delservice:',service);
      }
    },
    //内部拖拽事件
    eventDropAction: function(event, delta,revertFunc, jsEvent) {
      // console.log("eventDropAction in",event);
      // console.log("eventDropAction delta",delta);
      //先通过序号找到对应的服务项目
      var alist = this.get("serviceApplyWeekList").findBy("seq",event.id);
      var serviceItem = alist.get("item").findBy("code",event.code);
      //根据位移找到之前的服务项目
      var dayNo = Math.abs(event.dayOfWeek + delta._days);
      var hourOffset = delta._milliseconds/1000/3600 * 2;
      var hourNo = event.hourOfDay + hourOffset;
      var seqNow = dayNo*100 + hourNo;
      //移除之前的服务设置，增加之后的服务设置--由于之前已经在stop事件里移除了，所以这里不进行了
      serviceItem.set("selected",false);
      var alistNow = this.get("serviceApplyWeekList").findBy("seq",seqNow);
      // console.log('alistNow:',seqNow);
      var serviceItemNow = alistNow.get("item").findBy("code",event.code);
      serviceItemNow.set("selected",true);
      this.incrementProperty('flag');
    },
    pushServiceEventToApplyList(date,originalEventObject){
      //通过设置目标时间取得序号，并找到对应的区域数据
      let _self=this;
      this.set("selectedTime",date);
      console.log('date:',date);
      var seq = this.get("selectedTimeSeq");
      //根据序号查找到时间段数据块
      var alist = this.get("serviceApplyWeekList").findBy("seq",seq);
      //再根据服务项目对应的code查找到需要选择的护理项目
      var serviceItem = alist.get("item").findBy("code",originalEventObject.code);
      //在左侧拖拽框寻找当前项目
      let serviceList = _self.get('serviceList');
      let service = serviceList.findBy('code',originalEventObject.code);
      if(service.get('number')>0){
        if(!serviceItem.get("selected")){
          serviceItem.set("selected",true);
          //更改项目剩余次数
          service.set('number',service.get('number')-1);
        }
        this.send("servicePlanChange",alist);
      }

    },
    //服务项目变化后的后续处理
    servicePlanChange(alist){
      var _self = this;
      //添加记号，以触发其他compute数据
      var count = alist.get("count") + 1;
      let services = new Ember.A();
      alist.set("count",count);
      var copyToOther = function(serviceItem,dayNo,hourNo){
        for(let i=1;i<=7;i++){
          if(i===dayNo){
            continue;
          }
          var seq = i*100 + hourNo;
          //计算出序号后取得对应的服务列表
          var otherServiceList = _self.get("serviceApplyWeekList").findBy("seq",seq);
          //对照当前选择的项目，进行选中或取消选中
          var otherServiceItem = otherServiceList.get("item").findBy("code",serviceItem.get("code"));
          if(otherServiceItem.get("selected")&&!serviceItem.get("selected")){
            otherServiceItem.set("selected",false);
          }
          if(!otherServiceItem.get("selected")&&serviceItem.get("selected")){
            otherServiceItem.set("selected",true);
          }
        }
      };
      //把日服务内容复制到其他的格子里
      alist.get("item").forEach(function(serviceItem){
        //周类型的服务项目不拷贝
        if(serviceItem.get("type")===2){
          return;
        }
        if(serviceItem.get("selected")){
          copyToOther(serviceItem,alist.get("dayOfWeek"),alist.get("hourOfDay"));
          console.log('alist:',alist);
          // console.log('copyto:',alist.get("dayOfWeek"),alist.get("hourOfDay"));
        }
      });
      //保存修改后的项目

    }
    /////////////日历控件方法结束
  },


  /*拖拽部分*/
  initDrag:function (el) {
    var _self = this;
    var eventObject = {
      code:el.attr("code"),
      title: $.trim(el.text()) ,// use the element's text as the event title
    };

    // store the Event Object in the DOM element so we can get to it later
    el.data('eventObject', eventObject);
    // make the event draggable using jQuery UI
    el.draggable({
      zIndex: 999,
      revert: true,      // will cause the event to go back to its
      revertDuration: 0 , //  original position after the drag
      start:function(){
        el[0].style.width = '54%';
        console.log(el[0].style.width);
      },
      stop: function(){
        el[0].style.width = '';
        console.log("el stop in:",el);
        console.log(el[0].style.width);
        _self.set("currentDragObj",eventObject);
      }
    });
  },
});
