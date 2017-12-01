import Ember from 'ember';

export default Ember.Controller.extend({
  serviceFlag:0,
  planFlag:0,
  tipValue:'此服务项目已经排满，请先取消其他时间安排。',
  weekserviceFlag:false,
  dayServiceLoopStep:0,
  weekServiceLoopStep:0,
  mainController: Ember.inject.controller('business.mainpage'),
  isSubmit:"disabled",
  global_dataLoader: Ember.inject.service('data-loader'),
  weekList:Ember.computed('dayList','currentFirstDate',function(){
    let list = ['周日','周一','周二','周三','周四','周五','周六'];
    let today = ['周日','周一','周二','周三','周四','周五','周六'][new Date().getDay()];
    let dayList = this.get('dayList');
    let weekList = new Ember.A();
    for(let i = 0;i<list.length;i++){
      let item = Ember.Object.create({});
      item.set('week',list[i]);
      if(dayList){
        if(list[i]==today&&dayList.objectAt(i).get('today')){
          item.set('today',true);
        }
      }
      item.set('order',i);
      weekList.pushObject(item);
    }
    return weekList;
  }),
  //时间图标
  timeIconList:Ember.computed('projectModel',function(){
      let list = new Ember.A();
      let timeArr = [{
        order:1,
        selected:false,
        icon:'assets/images/icon/1clock.png',
        name:'1点'
      },{
        order:2,
        selected:false,
        icon:'assets/images/icon/2clock.png',
        name:'2点'
      },{
        order:3,
        selected:false,
        icon:'assets/images/icon/3clock.png',
        name:'3点'
      },{
        order:4,
        selected:false,
        icon:'assets/images/icon/4clock.png',
        name:'4点'
      },{
        order:5,
        selected:false,
        icon:'assets/images/icon/5clock.png',
        name:'5点'
      },{
        order:6,
        selected:false,
        icon:'assets/images/icon/6clock.png',
        name:'6点'
      },{
        order:7,
        selected:false,
        icon:'assets/images/icon/7clock.png',
        name:'7点'
      },{
        order:8,
        selected:false,
        icon:'assets/images/icon/8clock.png',
        name:'8点'
      },{
        order:9,
        selected:false,
        icon:'assets/images/icon/9clock.png',
        name:'9点'
      },{
        order:10,
        selected:false,
        icon:'assets/images/icon/10clock.png',
        name:'10点'
      },{
        order:11,
        selected:false,
        icon:'assets/images/icon/11clock.png',
        name:'11点'
      },{
        order:12,
        selected:false,
        icon:'assets/images/icon/12clock.png',
        name:'12点'
      },{
        order:13,
        selected:false,
        icon:'assets/images/icon/1clock.png',
        name:'13点'
      },{
        order:14,
        selected:false,
        icon:'assets/images/icon/2clock.png',
        name:'14点'
      },{
        order:15,
        selected:false,
        icon:'assets/images/icon/3clock.png',
        name:'15点'
      },{
        order:16,
        selected:false,
        icon:'assets/images/icon/4clock.png',
        name:'16点'
      },{
        order:17,
        selected:false,
        icon:'assets/images/icon/5clock.png',
        name:'17点'
      },{
        order:18,
        selected:false,
        icon:'assets/images/icon/6clock.png',
        name:'18点'
      },{
        order:19,
        selected:false,
        icon:'assets/images/icon/7clock.png',
        name:'19点'
      },{
        order:20,
        selected:false,
        icon:'assets/images/icon/8clock.png',
        name:'20点'
      },{
        order:21,
        selected:false,
        icon:'assets/images/icon/9clock.png',
        name:'21点'
      },{
        order:22,
        selected:false,
        icon:'assets/images/icon/10clock.png',
        name:'22点'
      },{
        order:23,
        selected:false,
        icon:'assets/images/icon/11clock.png',
        name:'23点'
      },{
        order:0,
        selected:false,
        icon:'assets/images/icon/12clock.png',
        name:'0点'
      }];

      timeArr.forEach(function(item){
        let time = Ember.Object.create(item);
        list.pushObject(time);
      });
      return list;
  }),
  queryObs:function(){
    var _self = this;
    var customerId = _self.get("customerId");
    if(!customerId){
      return;
    }
    this.store.query('nursingprojectitem',{
      filter:{
        item:{countType:{typecode:'countTypeByTime'}},
        project:{customer:{id:customerId}}
      }
    }).then(function(itemList){//按时执行的服务
      _self.set('allServiceList',itemList);
      _self.incrementProperty('serviceFlag');
    });
    this.store.query('nursingplanitem',{filter:{customer:{id:customerId}}}).then(function(nursingplanList){
      _self.set('nursingplanList',nursingplanList);
      _self.incrementProperty('planFlag');
    });

  }.observes("customerId","toTemplateFlag").on("init"),
  //当前老人的 所有计划任务模板
  customerPlanObs:function(){
    let _self = this;
    var customerId = this.get("curCustomer.id"),
        serviceFlag = this.get("serviceFlag"),
        planFlag = this.get("planFlag"),
        projectFlag = this.get("projectFlag"),
        customer = this.get('curCustomer');//当前老人
    if(!serviceFlag||!planFlag||!projectFlag||!customer){return;}
    let allServiceList = this.get('allServiceList');//所有的按时执行服务
    let nursingplanList = this.get('nursingplanList');//所有该老人的护理模板项
      //所有该老人任务计划模板
      let customerPlanListWeek = new Ember.A();//按 "周" 执行的定时任务
      let customerPlanListDay = new Ember.A();//按 "日" 执行的定时任务
      nursingplanList.forEach(function(item){
        if(item.get("weekTab")>=0){//如果有 周标记字段
          customerPlanListWeek.pushObject(item);
        }else {
          customerPlanListDay.pushObject(item);
        }
      });
      _self.set("customerPlanListWeek",customerPlanListWeek);//按周
      _self.set("customerPlanListDay",customerPlanListDay);//按天
      let projectList = _self.get('projectList');//所有的护理方案
      let project = projectList.findBy('customer.id',customerId);//findBy当前老人的护理方案
      let dayServiceList = new Ember.A();
      let timeIconList = _self.get('timeIconList');//时间图标
      allServiceList.forEach(function(service){
        if(service.get('period.typecode') == 'periodDay'){//服务按每日的
          let item = Ember.Object.create({});
          item.set('name',service.get('item.name'));
          item.set('frequency',service.get('frequency'));//频次
          // item.set('hasFrequency',0);
          var i = 0;
          customerPlanListDay.forEach(function(dayItemI){//获取当前 service和数据库中相同服务有几条数据
            if(dayItemI.get("item.id")==service.get("id")){
              i++;
            }
          });
          item.set('hasFrequency',i);
          item.set('item',service.get('item'));
          let list = new Ember.A();//模板的时间list
          let listTwo = new Ember.A();//空白的时间list
          timeIconList.forEach(function(time){
            customerPlanListDay.forEach(function(dayItem){//显示已经选中的样式逻辑
              if(dayItem.get("item.id")==service.get("id")){// 按日的任务模板的护理方案 和 老人所属护理方案的id相同
                  if(dayItem.get("startTimeTab")==time.get("order")){//如果 任务模板的开始时间和order相等
                    dayItem.set('icon',time.get('icon'));
                    dayItem.set('name',time.get('name'));
                    dayItem.set("selected",true);
                    list.pushObject(dayItem);
                  }
              }
            });
          });
          timeIconList.forEach(function(time){
            let item = _self.store.createRecord('nursingplanitem',{});
            item.set('icon',time.get('icon'));
            item.set('name',time.get('name'));
            item.set('item',service);
            item.set('customer',customer);
            item.set('startTimeTab',time.get('order'));
            item.set('selected',false);
            listTwo.pushObject(item);
          });
          list.forEach(function(listIem){
            listTwo.forEach(function(listTwoItem){
              if(listIem.get("name")==listTwoItem.get("name")){
                listTwoItem.set("selected",true);
              }
            });
          });
          item.set('dateList',listTwo);
          if(!dayServiceList.findBy('item.id',item.get('item.id'))){
            dayServiceList.pushObject(item);
          }
        }
      });
      _self.set("dayServiceList",dayServiceList);
      let weekServiceList = new Ember.A();
      let dayList = new Ember.A();
      let weeklist = ['周日','周一','周二','周三','周四','周五','周六'];
      for(let i = 0;i<weeklist.length;i++){
        let item = Ember.Object.create({});
        item.set('week',weeklist[i]);
        item.set('order',i);
        dayList.pushObject(item);
      }
      allServiceList.forEach(function(service){
        if(service.get('period.typecode') == 'periodWeek'){//服务周期是'周'的话
          let item = Ember.Object.create({});
          item.set('name',service.get('item.name'));
          item.set('id',service.get('id'));//给182行 用的id
          var i = 0;
          customerPlanListWeek.forEach(function(weekItemI){//获取当前 service和数据库中相同服务有几条数据
            if(weekItemI.get("item.id")==service.get("id")){
              i++;
            }
          });
          item.set('hasFrequency',i);//已经设置的 频次
          item.set('frequency',service.get('frequency'));//频次
          item.set('item',service.get('item'));//护理项目
          let datelist = new Ember.A();
          dayList.forEach(function(day){
            let date = Ember.Object.create({});
            date.set('week',day.get('week'));
            date.set('order',day.get('order'));
            customerPlanListWeek.forEach(function(weekItem){
              if(weekItem.get("item.id")==service.get("id")){
                if(weekItem.get("weekTab")==day.get('order')){
                  date.set("choosed",true);
                }
              }
            });
            let list2 = new Ember.A();//模板的时间list
            let listTwo2 = new Ember.A();//空白的时间list
            timeIconList.forEach(function(time){
              customerPlanListWeek.forEach(function(weekItem){//显示已经选中的样式逻辑
                if(weekItem.get("item.id")==service.get("id")){// 按日的任务模板的护理方案 和 老人所属护理方案的id相同
                  if(weekItem.get("weekTab")==day.get("order")){
                    if(weekItem.get("startTimeTab")==time.get("order")){//如果 任务模板的开始时间和order相等
                      weekItem.set('icon',time.get('icon'));
                      weekItem.set('name',time.get('name'));
                      weekItem.set("selected",true);
                      list2.pushObject(weekItem);
                    }
                  }
                }
              });

            });
            timeIconList.forEach(function(time){
              let item = _self.store.createRecord('nursingplanitem',{});
              item.set('icon',time.get('icon'));
              item.set('name',time.get('name'));
              item.set('weekTab',day.get('order'));
              item.set('item',service);
              item.set('customer',customer);
              item.set('startTimeTab',time.get('order'));
              item.set('selected',false);
              listTwo2.pushObject(item);
            });
            list2.forEach(function(listIem){
              listTwo2.forEach(function(listTwoItem){
                if(listIem.get("name")==listTwoItem.get("name")){
                  listTwoItem.set("selected",true);
                }
              });
            });
            date.set('serviceList',listTwo2);
            datelist.pushObject(date);
          });
          item.set('dayList',datelist);
          if(!weekServiceList.findBy('item.id',item.get('item.id'))){
            weekServiceList.pushObject(item);
          }

        }
      });
      _self.set("weekServiceList",weekServiceList);
      _self.set("rightBtn",false);//每次切换人的时候都刷新重置下 切换按钮为false
      _self.set("leftBtn",false);
      _self.set("weekrightBtn",false);
      _self.set("weekleftBtn",false);
      _self.set("showLoadingImg",false);//关闭加载图片
      Ember.run.schedule("afterRender",this,function() {
        $("#position_absolute").css("left",0);//设置为初始值0 (每次已进入就设置为初始值)
        $("#position_absoluteWeek").css("left",0);//设置为初始值0
        $($("#position_absolute").children("div.white_space").get(0)).trigger("click");//第一个子元素点击
        var theWidth = 0;//初始化日计划的宽
        $("#position_absolute div.white_space").each(function(){
          theWidth += parseInt($(this).css("width")) + 8;
        });
        theWidth = theWidth + 3;//有点小问题差一像素 直接大方点加3像素
        $("#position_absolute").width(theWidth);
        var $daySelect =  $("#daySelect");
        var daySelectWidth =  parseInt($daySelect.css("width"));
        if(theWidth > daySelectWidth){
          _self.set("rightBtn",true);
        }else {
          _self.set("rightBtn",false);
        }
        var weekWidth = 0;//初始化周计划的宽
        $("#position_absoluteWeek div.white_space").each(function(){
          weekWidth += parseInt($(this).css("width")) + 8;
        });
        weekWidth = weekWidth + 3;//有点小问题差一像素 直接大方点加3像素
        $("#position_absoluteWeek").width(weekWidth);
        var $weekSelect =  $("#weekSelect");
        var weekSelectWidth =  parseInt($weekSelect.css("width"));
        if(weekWidth > weekSelectWidth){
          _self.set("weekrightBtn",true);
        }else {
          _self.set("weekrightBtn",false);
        }

      });


    // var customer = this.get('curCustomer');//当前老人
    // this.get("target").queryNursingplanitem(customer.get("id"));
    // App.lookup("route:business.mainpage.plan-template");
    // let allServiceList = this.get('allServiceList');//所有的按时执行服务
    // var nursingplanList = this.get("nursingplanList");//所有任务计划模板
  // }.observes('curCustomer','nursingplanList','allServiceList'),
}.observes('serviceFlag','planFlag','projectFlag','curCustomer').on('init'),

  confirm(){
    // this.set("curService","");//set curService 为空从新选择
    this.set("curdate","");//set curdate 为空从新选择
    this.set('detailEdit',true);//不要编辑了 直接set为true
    let customer = this.get('customer');
    let allBedList = this.get('allBedList');
    let bed = allBedList.findBy('id',customer.get('bed.id'));
    this.set('customerId',this.get('customer.id'));
    this.set('curCustomer',this.get('customer'));
    this.set('editcustomer',false);
    this.set('curBed',bed);
    if(this.get("detailEdit")){
      Ember.run.schedule("afterRender",this,function() {
        $($("#position_absolute").children("div.white_space").get(0)).trigger("click");//第一个子元素点击
      });
    }
  },

  actions:{
    toPlan(){
      let customer = this.get('customer');
      let params = {customerId : customer.get("id")};
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('nursing-plan',params);
    },
    toRight(type){
      var _self = this;
      var jQueryMove;
      if(type=='day'){
        _self.set("leftBtn",true);
        let dayServiceLoopStep = this.get('dayServiceLoopStep');
        let moveItemId = '#day-service-loop-' + dayServiceLoopStep;//要移动的日项目
        let moveWidth = parseInt($(moveItemId).css('width')) + 8;
        var $daySelect =  $("#daySelect"),
            $position_absolute =  $("#position_absolute"),
            daySelectWidth =  parseInt($daySelect.css("width")),//1058
            position_absoluteWidth =  parseInt($position_absolute.css("width")),
            position_absoluteLeft =  parseInt($position_absolute.css("left")); //动一次是 -988px
            console.log("position_absolute position_absoluteLeft",position_absoluteLeft);
            console.log("position_absolute daySelectWidth",daySelectWidth);
            console.log("position_absolute position_absoluteWidth",position_absoluteWidth);
            jQueryMove = daySelectWidth;
            $position_absolute.animate({
              left: "-=" + moveWidth,
            },500,function(){
              position_absoluteLeft =  parseInt($position_absolute.css("left"));
              //移动后剩余的右侧部门小于 父级元素的宽隐藏右侧btn
              console.log("position_absolute position_absoluteLeft init11111111111",position_absoluteLeft);
              console.log("position_absolute position_absoluteLeft init11111111111 jQueryMove",jQueryMove);
              if(position_absoluteWidth + position_absoluteLeft < jQueryMove){
                _self.set("rightBtn",false);
              }
            });
            this.incrementProperty('dayServiceLoopStep');
      }else {
        _self.set("weekleftBtn",true);
        let weekServiceLoopStep = this.get('weekServiceLoopStep');
        let moveItemId = '#week-service-loop-' + weekServiceLoopStep;//要移动的日项目
        let moveWidth = parseInt($(moveItemId).css('width')) + 8;
        var $weekSelect =  $("#weekSelect"),
            $position_absoluteWeek =  $("#position_absoluteWeek"),
            weekSelectWidth =  parseInt($weekSelect.css("width")),//1058
            position_absoluteWeekWidth =  parseInt($position_absoluteWeek.css("width")),
            position_absoluteWeekLeft =  parseInt($position_absoluteWeek.css("left")); //动一次是 -988px
            jQueryMove = weekSelectWidth;
            $position_absoluteWeek.animate({
              left: "-=" + moveWidth,
            },500,function(){
              position_absoluteWeekLeft =  parseInt($position_absoluteWeek.css("left"));
              if(position_absoluteWeekWidth + position_absoluteWeekLeft < jQueryMove){
                _self.set("weekrightBtn",false);
              }

            });
            this.incrementProperty('weekServiceLoopStep');
      }

    },
    toLeft(type){
      var _self = this;
      var jQueryMove;
      if(type=='day'){
        _self.set("rightBtn",true);
        let dayServiceLoopStep = this.get('dayServiceLoopStep')-1;
        let moveItemId = '#day-service-loop-' + dayServiceLoopStep;//要移动的日项目
        let moveWidth = parseInt($(moveItemId).css('width')) + 8;
        var $daySelect =  $("#daySelect"),
            $position_absolute =  $("#position_absolute"),
            daySelectWidth =  parseInt($daySelect.css("width")),
            position_absoluteWidth =  parseInt($position_absolute.css("width")),
            position_absoluteLeft =  parseInt($position_absolute.css("left"));
            jQueryMove = daySelectWidth;
            $position_absolute.animate({
              left: "+="+ moveWidth,
            },500,function(){
              position_absoluteLeft =  parseInt($position_absolute.css("left"));
              console.log("position_absolute position_absoluteLeft toLeft toLeft init11111111111",position_absoluteLeft);
              // if(position_absoluteWidth + position_absoluteLeft > jQueryMove){
              //   _self.set("rightBtn",true);
              // }
              if(position_absoluteLeft === 0){
                _self.set("leftBtn",false);
              }
            });
            this.set('dayServiceLoopStep',dayServiceLoopStep);
      }else {
        _self.set("weekrightBtn",true);
        let weekServiceLoopStep = this.get('weekServiceLoopStep')-1;
        let moveItemId = '#week-service-loop-' + weekServiceLoopStep;//要移动的日项目
        let moveWidth = parseInt($(moveItemId).css('width')) + 8;
        var $weekSelect =  $("#weekSelect"),
            $position_absoluteWeek =  $("#position_absoluteWeek"),
            weekSelectWidth =  parseInt($weekSelect.css("width")),
            position_absoluteWeekWidth =  parseInt($position_absoluteWeek.css("width")),
            position_absoluteWeekLeft =  parseInt($position_absoluteWeek.css("left"));
            jQueryMove = weekSelectWidth;
            $position_absoluteWeek.animate({
              left: "+="+ moveWidth,
            },500,function(){
              position_absoluteWeekLeft =  parseInt($position_absoluteWeek.css("left"));
              if(position_absoluteWeekLeft === 0){
                _self.set("weekleftBtn",false);
              }
            });
          this.set('weekServiceLoopStep',weekServiceLoopStep);
      }

    },
    setService(service,params){
      var weekserviceFlag = this.get("weekserviceFlag");
      this.set('curService',service);
      if(!weekserviceFlag){
        this.set("weekserviceFlagOBj",service);
      }
      var dayServiceList = this.get("dayServiceList");
      var weekServiceList = this.get("weekServiceList");
      if(params=='day'){//当setService方法 执行的是日任务时
        weekServiceList.forEach(function(item){//把周任务的 selected都set 为false
          item.set("selected",false);
        });
        dayServiceList.forEach(function(item){
          if(item==service){
            item.set("selected",true);
          }else {
            item.set("selected",false);
          }
        });
        this.set("weekServiceList",weekServiceList);
        this.set("dayServiceList",dayServiceList);
      }else if(params=='week'){//当setService方法 执行的是周任务时
        var weekserviceFlagOBj = this.get("weekserviceFlagOBj");
        if(weekserviceFlagOBj!=service){//如果当前周的service 不等于上一个周service
          this.set("curdate",false);//周项目具体时间点隐藏
          // this.set("weekserviceFlag",false);
          this.set("weekserviceFlagOBj",service);
        }
        this.set("weekserviceFlag",true);
        dayServiceList.forEach(function(item){//周任务 把日任务的 selected都set 为false
          item.set("selected",false);
        });
        weekServiceList.forEach(function(item){
          if(item==service){
            item.set("selected",true);
          }else {
            item.set("selected",false);
          }
        });
        // this.set("curdate",false);//周项目具体时间点隐藏
        // weekServiceList.forEach(function(item){
        //   item.get("dayList").forEach(function(dayItem){
        //     if(dayItem.get("selected")){
        //       dayItem.set("selected",false);
        //     }
        //   });
        // });
        this.set("dayServiceList",dayServiceList);
        this.set("weekServiceList",weekServiceList);
        this.send('chooseWeek',this.get('curService.dayList').get('firstObject'));
      }

    },
    chooseTime(service){//
      let curService = this.get('curService');
      console.log(service,service.get('weekTab'));
      if(service.get('selected')){
        let count = curService.get('hasFrequency');
        if(count>0){
          curService.set('hasFrequency',count-1);
          service.set('selected',false);
        }
      }else{
        let count = curService.get('hasFrequency');
        if(count<curService.get('frequency')){
          curService.set('hasFrequency',count+1);
          service.set('selected',true);
        }else{
          service.set('serviceFull',true);
          setTimeout(function(){
            service.set('serviceFull',false);
          },3000);
        }
      }
      this.set('isSubmit',"");
    },
    chooseWeek(date){
      let curServiceDayList = this.get('curService.dayList');
      this.set('curdate',date);
      this.set('curdate.selected',true);
      curServiceDayList.forEach(function(item){
        if(item==date){
          item.set("selected",true);
        }else {
          item.set("selected",false);
        }
      });
      this.set("curService.dayList",curServiceDayList);
    },
    save(){
      let _self = this;
      let dayServiceList = this.get('dayServiceList');
      let weekServiceList = this.get('weekServiceList');
      let customer = this.get('curCustomer');
      let items = new Ember.A();
      dayServiceList.forEach(function(service){
        service.get('dateList').forEach(function(date){
          if(date.get('selected')){
            items.pushObject(date);
          }
        });
      });
      weekServiceList.forEach(function(service){
        service.get('dayList').forEach(function(date){
          date.get('serviceList').forEach(function(item){
            if(item.get('selected')){
              items.pushObject(item);
            }
          });
        });
      });
      console.log('saveItems',items,items.get('length'));//没有打印？chrome浏览器bug
      App.lookup('controller:business.mainpage').openPopTip("正在保存");
      if(items){
        let customernursingplanmodel = this.store.createRecord('customernursingplanmodel',{});
        customernursingplanmodel.set('items',items);
        customernursingplanmodel.set('remark',customer.get("id"));//把老人id放到remark里
        customernursingplanmodel.save().then(function(){
          App.lookup('controller:business.mainpage').showPopTip("保存成功");
          // App.lookup('route:business.mainpage.plan-template').queryNursingplanitem();
          _self.set('curService',false);
          console.log('save success!!!',items);
        });
      }

    },
    //重置弹层
    detailCancel(){//取消的时候把 所有选中项都set为false 很low的方法

      var _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否重置",function(){
        _self.send('cancelPassSubmit');
      });
    },
    //页面重置
    cancelPassSubmit(){
      // let customer = this.get('customer');
      // let params = {customerId : customer.get("id")};
      // this.get("mainController").switchMainPage('cs-home');
      // this.get("mainController").switchMainPage('plan-template',params);
      // let route = App.lookup('route:business.mainpage.plan-template');
      // App.lookup('controller:business.mainpage').refreshPage(route);
      // this.set('isSubmit',"disabled");
      var toTemplateFlag = this.get("toTemplateFlag");//改变模式了就所以重置刷新就需要改变obs观察者观察项就好了
      this.incrementProperty('toTemplateFlag');
    },
    detailEdit(){
      this.set("detailEdit",true);
      // Ember.run.schedule("afterRender",this,function() {
      //   var selectEle = document.getElementsByClassName("daySelect")[0];
      //
      // });
      $($("#position_absolute").children("div.white_space").get(0)).trigger("click");//第一个子元素点击
    },
    chooseCustomer(customer){
      this.set('customer',customer);
      this.set('isSubmit',"disabled");
    },
    editCustomer(){
      // this.set('editcustomer',true);
      var mainpageController = App.lookup('controller:business.mainpage');
      mainpageController.switchMainPage('nursing-template');
    },
    exitCustomer(){
      this.set('editcustomer',false);
    },
    confirm(){
      this.confirm();
    },
  }

});
