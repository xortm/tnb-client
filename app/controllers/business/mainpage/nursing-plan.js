import Ember from 'ember';

export default Ember.Controller.extend({
    queryCondition:'',
    dateService: Ember.inject.service("date-service"),
    mainController: Ember.inject.controller('business.mainpage'),
    flag:0,
    toTemplateFlag:0,
    isSubmit:"disabled",
    couldCopy:true,
    tipValue:'此服务项目已经排满，请先取消其他时间安排。',
    couldCopyObs:function(){
      let flag = this.get('flag');
      if(flag===0){
        this.set('couldCopy',true);
      }else{
        this.set('couldCopy',false);
      }
    }.observes('flag'),
    searchCustomer:true,
    statusService: Ember.inject.service("current-status"),
    allDayServiceName:'暂无',
    allWeekServiceName:'暂无',
    //当前周
    curTime:function(){
      let date = this.get('currentFirstDate');
      let totaldays = 0;
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      let  days = new Array(12);
      days[0] = 31;
      days[2] = 31;
      days[3] = 30;
      days[4] = 31;
      days[5] = 30;
      days[6] = 31;
      days[7] = 31;
      days[8] = 30;
      days[9] = 31;
      days[10] = 30;
      days[11] = 31;
      if (Math.round(year / 4) == year / 4) {
          days[1] = 29;
      } else {
          days[1] = 28;
      }
      if (month === 0) {
         totaldays = totaldays + day;
     } else {
         for (let count = 1; count <= month; count++) {
             totaldays = totaldays + days[count - 1];
         }
         totaldays = totaldays + day;
     }
     let week = Math.ceil(totaldays / 7);
      this.set('curWeek',week);
      this.set('curYear',year);
    }.observes('currentFirstDate'),

    theWeek:Ember.computed('curWeek',function(){
      let curWeek = this.get('curWeek');
      let week = this.get('dateService').theWeek();
      if(week==curWeek){
        return true;
      }else{
        return false;
      }
    }),
    //周数选择弹层
    chooseWeek:Ember.computed('curWeek',function(){
      let list = new Ember.A();
      let week = this.get('curWeek');
      let d1 = new Date();
      let d2 = new Date();
      d2.setMonth(0);
      d2.setDate(1);
      let rq = d1-d2;
      let s1 = Math.ceil(rq/(24*60*60*1000));
      let s2 = Math.ceil(s1/7);
      for(let i=1;i<53;i++){
        let item = Ember.Object.create({});
        item.set('num',i);
        item.set('text','第'+i+'周');
        if(i == week){
          item.set('hasSelected',true);
        }
        if(i == s2){
          item.set('hasChoosed',true);
        }
        list.pushObject(item);

      }
      return list;
    }),
    //项目弹层数据
    serviceDate:Ember.computed('curdate',function(){
      let curdate = this.get('curdate');
      let type = this.get('curType');
      let serviceDate = Ember.Object.create({});
      let services = new Ember.A();
      let curcustomer = this.get('curcustomer');
      if(type=='day'){
        curdate.get('dayServices').forEach(function(service){
          let item = Ember.Object.create({});
          let list = new Ember.A();
          service.get('serviceList').forEach(function(serv){
            let item = Ember.Object.create({});
            item.set('icon',serv.get('icon'));
            item.set('name',serv.get('name'));
            item.set('item',serv.get('item'));
            item.set('selected',serv.get('selected'));
            list.pushObject(item);
          });
          item.set('serviceList',list);
          item.set('weekPlan',service.get('weekPlan'));
          item.set('item',service.get('item'));
          if(service.get('weekPlan')){
            let weekServices = curcustomer.get('weekService').findBy('item.id',service.get('item.id'));
            item.set('frequency',weekServices.get('frequency'));
            item.set('leftFrequency',weekServices.get('leftFrequency'));
          }else{
            item.set('frequency',service.get('frequency'));
            item.set('leftFrequency',service.get('leftFrequency'));
          }

          services.pushObject(item);
        });
      }
      if(type=='week'){
        curdate.get('weekServices').forEach(function(service){
          let item = Ember.Object.create({});
          let list = new Ember.A();
          service.get('serviceList').forEach(function(serv){
            let item = Ember.Object.create({});
            item.set('icon',serv.get('icon'));
            item.set('name',serv.get('name'));
            item.set('item',serv.get('item'));

            item.set('selected',serv.get('selected'));
            list.pushObject(item);
          });
          item.set('serviceList',list);
          item.set('weekPlan',service.get('weekPlan'));
          item.set('item',service.get('item'));
          if(service.get('weekPlan')){
            let weekServices = curcustomer.get('weekService').findBy('item.id',service.get('item.id'));
            item.set('frequency',weekServices.get('frequency'));
            item.set('leftFrequency',weekServices.get('leftFrequency'));
          }else{
            item.set('frequency',service.get('frequency'));
            item.set('leftFrequency',service.get('leftFrequency'));
          }

          services.pushObject(item);
        });
      }
      serviceDate.set('services',services);
      return serviceDate;
    }),

    //观察弹窗数据,如果变化就重置宽
    serviceDateObs:function(){
      var _self = this;
      //hbs画完处理(这样更好的获得DOM元素)
      Ember.run.schedule("afterRender",this,function() {

      });

    }.observes("serviceDate"),
    customerList:Ember.computed("planList",'projectList',function(){
        let projectList = this.get('projectList');
        let planList = this.get('planList');
        let list = new Ember.A();
        let hasCustomer = new Ember.A();
        if(!projectList){
          return null;
        }
        projectList.forEach(function(project){
          if(!planList.findBy('customer.id',project.get('customer.id'))){
            list.pushObject(project.get('customer'));
          }
        });
        list.forEach(function(customer){
          customer.set('namePinyin',pinyinUtil.getFirstLetter(customer.get("name")));
        });
        return list;
    }),
    buildList:Ember.computed('customerList',function(){
      let _self = this;
      let customerList = this.get('customerList');
      let roomList = new Ember.A();
      let buildList = new Ember.A();
      if(!customerList){
        return null;
      }
      let filter = {};
      for(let i=0;i<customerList.length;i++){
            let j = i+1;
            let key = "id@$or1---"+j;
            let value = customerList.objectAt(i).get('bed.id');
            let filterNew = {};
            filterNew[key] = value;
            filter = $.extend({},filter, filterNew);
        }
      this.store.query('bed',{filter}).then(function(bedList){
        bedList.forEach(function(bed){
          if(!roomList.findBy('id',bed.get('room.id'))){
            roomList.pushObject(bed.get('room'));
          }
        });
        roomList.forEach(function(room){
          let beds = bedList.filter(function(bed){
            return bed.get('room.id')==room.get('id');
          });
          let customers = new Ember.A();
          customerList.forEach(function(customer){
            if(beds.findBy('id',customer.get('bed.id'))){
              let bed = beds.findBy('id',customer.get('bed.id'));
              customer.set('curBed',bed);
              customers.pushObject(customer);
            }
          });
          room.set('customers',customers);
          if(!buildList.findBy('id',room.get('floor.id'))){
            buildList.pushObject(room.get('floor'));
          }
        });
        buildList.forEach(function(build){
          let rooms = roomList.filter(function(room){
            return room.get('floor.id')==build.get('id');
          });
          build.set('currooms',rooms);
          let name = build.get('building.name') + '-' + build.get('name');
          build.set('allname',name);
        });
      });
      return buildList;
    }),
    //时间处理函数
    formatDate(date){
        let year = date.getFullYear()+'年';
        let month = (date.getMonth()+1)+'月';
        let day = date.getDate()+'日';
        return year+month+day;
    },
    addDate(date,n){
        date.setDate(date.getDate()+n);
        return date;
    },
    setDate(date){
        let cells = document.getElementById('monitor').getElementsByTagName('span');
        let clen = cells.length;
        let week = date.getDay();
        let _self = this;
        let currentFirstDate = new Date(date);
        date = this.addDate(date,week*-1);
        for(let i = 0;i<clen;i++){
            cells[i].innerHTML = _self.formatDate(i===0 ? date : _self.addDate(date,6));
        }
        this.set('currentFirstDate',currentFirstDate);
    },
    //列表日期显示
    dayList:Ember.computed('currentFirstDate',function(){
      let _self = this;
      let today = new Date().getDate();
      let month = new Date().getMonth()+1;
      let currentFirstDate = this.get('currentFirstDate');
      if(!currentFirstDate){
        return null;
      }
      let dayList = new Ember.A();
      let week = currentFirstDate.getDay();
      let formatDate = function(date){
        let day = date.getDate();
        let year = date.getFullYear();
        let month = (date.getMonth()+1);
        let arr = {
          day:day,
          month:month,
          year:year
        };
        return arr;
      };
      let addDate = function(date,n){
        date.setDate(date.getDate()+n);
        return date;
      };
      let date = this.addDate(currentFirstDate,week*-1);
      for(let i=0;i<7;i++){
        let item = Ember.Object.create({});
        let day = formatDate(i===0 ? date : addDate(date,1));
        item.set('day',day.day);
        item.set('month',day.month);
        item.set('year',day.year);
        item.set('order',i);
        if(day.day==today&&day.month==month){
          item.set('today',true);
        }
        dayList.pushObject(item);
      }
      return dayList;
    }),
    //列表周显示
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
    //页面显示的表格
    customerPlanList:Ember.computed('customer','projectList','dayList','weekList','serviceList','planItemList',function(){
      let customer = this.get('customer');
      let dayList = this.get('dayList');
      let weekList = this.get('weekList');
      let serviceList = this.get('serviceList');//护理方案中，定时执行的项目列表
      let projectList = this.get('projectList');//护理方案列表
      let timeIconList = this.get('timeIconList');
      let planItemList = this.get('planItemList');//当前老人一个月内的护理计划
      let customerPlanList = new Ember.A();
      let _self = this;
      if(!customer){
        console.log('no customer');
        return null;
      }
      if(!projectList){
        console.log('no projectList');
        return null;
      }
      if(!planItemList){
        console.log('no planItemList');
        return null;
      }
      if(!serviceList){
        console.log('no serviceList');
        return null;
      }
        let project = projectList.findBy('customer.id',customer.get('id'));//当前老人的护理方案
        let planItem = planItemList.filter(function(planItem){
          //当前老人本周的所有护理计划
          return (planItem.get('customer.id') == customer.get('id'))  &&  (planItem.get('weekIndex') == _self.get('curWeek'));
        });
        let item  = Ember.Object.create({});//每一个老人新建一个对象，用来承载其他各种数据
        let services = serviceList.filter(function(service){
          //老人的护理方案所包含的所有的定时执行的护理项目
          return service.get('project.id') == project.get('id');
        });
        let weekService = new Ember.A();
        item.set('curBed',customer.get('curBed'));
        item.set('name',customer.get('name'));
        item.set('customerID',customer.get('id'));
        item.set('services',services);
        services.forEach(function(service){
          if(service.get('item.period.typecode')=='periodWeek'){
            //老人所有的周项目，频次放到外层统计
            let realService = Ember.Object.create({});
            realService.set('item',service.get('item'));
            realService.set('frequency',service.get('frequency'));
            realService.set('leftFrequency',service.get('frequency'));
            weekService.pushObject(realService);
          }
        });
        let dateList = new Ember.A();
        dayList.forEach(function(day){
          //当前一周，7天，每天是一个格子，item
          let item = Ember.Object.create({});
          let planitem = planItem.filter(function(plan){
            //取到当天的劥计划
            return plan.get('weekTab') == day.get('order');
          });
          item.set('planitem',planitem);
          item.set('day',day.get('day'));
          let serviceName = '';
          let servList = new Ember.A();

          // services.forEach(function(service){
          //   //每天都会有一个计划列表，每个项目是一个item
          //   let list = new Ember.A();
          //   let item = Ember.Object.create({});
          //   let planservice = planitem.filter(function(plan){
          //     //去当当天已经安排的护理项目
          //     return plan.get('item.item.id') == service.get('item.id');
          //   });
          //   item.set('item',service.get('item'));
          //   item.set('frequency',service.get('frequency'));
          //   let count = service.get('frequency');
          //   timeIconList.forEach(function(time){
          //     //每个项目新建24条护理计划item
          //     let item = _self.store.createRecord('nursingplandetail',{});
          //     item.set('day',day.get('day'));
          //     item.set('icon',time.get('icon'));
          //     item.set('name',time.get('name'));
          //     item.set('item',service);
          //     item.set('yearTab',day.get('year'));
          //     item.set('weekTab',day.get('order'));
          //     item.set('customer',customer);
          //     item.set('weekIndex',_self.get('curWeek'));
          //     item.set('startTimeTab',time.get('order'));
          //     item.set('selected',false);
          //     if(planservice.findBy('startTimeTab',time.get('order').toString())){
          //       //根据已安排项目的该开始时间，找到对应的位置，设为已选状态，并将对应的频次-1，周项目将外层的频次-1
          //       item.set('selected',true);
          //       item.set('seq',planservice.findBy('startTimeTab',time.get('order').toString()).get('id'));
          //       count = count-1;
          //       if(weekService.findBy('item.id',service.get('item.id'))){
          //         weekService.findBy('item.id',service.get('item.id')).set('leftFrequency',weekService.findBy('item.id',service.get('item.id')).get('leftFrequency')-1);
          //       }
          //     }
          //     service.set('leftFrequency',count);
          //     list.pushObject(item);
          //   });
          //   item.set('serviceList',list);
          //   item.set('leftFrequency',service.get('leftFrequency'));
          //   if(item.get('item.period.typecode')=='periodWeek'){
          //     //设置周项目颜色
          //     item.set('weekPlan',true);
          //   }
          //   servList.pushObject(item);
          // });
          //
          // item.set('services',servList);

          //每个格子分为日项目dayServices,周项目weekServices，两个项目列表
          let dayServices = new Ember.A();
          let weekServices = new Ember.A();
          //遍历所有项目，每个项目生成24条护理计划
          services.forEach(function(service){
            //每天都会有一个计划列表，每个项目是一个item
            let list = new Ember.A();
            let item = Ember.Object.create({});
            let planservice = planitem.filter(function(plan){
              //去当当天已经安排的护理项目
              return plan.get('item.item.id') == service.get('item.id');
            });
            item.set('item',service.get('item'));
            item.set('frequency',service.get('frequency'));
            let count = service.get('frequency');
            timeIconList.forEach(function(time){
              //每个项目新建24条护理计划item
              let item = _self.store.createRecord('nursingplandetail',{});
              item.set('day',day.get('day'));
              item.set('icon',time.get('icon'));
              item.set('name',time.get('name'));
              item.set('item',service);
              item.set('yearTab',day.get('year'));
              item.set('weekTab',day.get('order'));
              item.set('customer',customer);
              item.set('weekIndex',_self.get('curWeek'));
              item.set('startTimeTab',time.get('order'));
              item.set('selected',false);
              if(planservice.findBy('startTimeTab',time.get('order').toString())){
                //根据已安排项目的该开始时间，找到对应的位置，设为已选状态，并将对应的频次-1，周项目将外层的频次-1
                item.set('selected',true);
                item.set('seq',planservice.findBy('startTimeTab',time.get('order').toString()).get('id'));
                count = count-1;
                if(weekService.findBy('item.id',service.get('item.id'))){
                  weekService.findBy('item.id',service.get('item.id')).set('leftFrequency',weekService.findBy('item.id',service.get('item.id')).get('leftFrequency')-1);
                }
              }
              service.set('leftFrequency',count);
              list.pushObject(item);
            });
            item.set('serviceList',list);
            item.set('leftFrequency',service.get('leftFrequency'));
            if(item.get('item.period.typecode')=='periodWeek'){
              //设置周项目颜色,将不同类型的项目访入两个列表
              item.set('weekPlan',true);
              weekServices.pushObject(item);
            }else{
              dayServices.pushObject(item);
            }
            // servList.pushObject(item);
          });
          let weekNum = 0; //已安排周项目个数
          let dayNum = 0; //已安排日项目个数
          // servList.forEach(function(service){
          //   service.get('serviceList').forEach(function(serv){
          //     if(service.get('item.period.typecode')=='periodWeek'){
          //       if(serv.get('selected')){
          //         weekNum+=1 ;
          //       }
          //     }else if(service.get('item.period.typecode')=='periodDay'){
          //       if(serv.get('selected')){
          //         dayNum+=1 ;
          //       }
          //     }
          //   });
          // });

          weekServices.forEach(function(service){
            service.get('serviceList').forEach(function(serv){
              if(serv.get('selected')){
                      weekNum+=1 ;
                    }
            });
          });
          dayServices.forEach(function(service){
            service.get('serviceList').forEach(function(serv){
              if(serv.get('selected')){
                      dayNum+=1 ;
                    }
            });
          });

          item.set('weekServices',weekServices);
          item.set('dayServices',dayServices);
          // //如果没有安排的项目，列表显示未安排
          // if(weekNum+dayNum===0){
          //   item.set('noplan',true);
          // }else{
          //   item.set('noplan',false);
          // }
          item.set('weekNum',weekNum);
          item.set('dayNum',dayNum);
          dateList.pushObject(item);
        });
        item.set('weekService',weekService);
        item.set('dateList',dateList);
        customerPlanList.pushObject(item);

      return customerPlanList;
    }),
    curcustomerObs:function(){
      let curdate = this.get('curdate');
      let curcustomer = this.get('curcustomer');
      let curType = this.get('curType');
      if(!curdate){
        return null;
      }
      let services ;
      if(curType == 'day'){
        services = curdate.get('dayServices');
      }
      if(curType == 'week'){
        services = curdate.get('weekServices');
      }
      let weekServices = curcustomer.get('weekService');
      let list = new Ember.A();

      services.forEach(function(service){
        if(service.get('weekPlan')){
          list.pushObject(service);
        }
      });
      list.forEach(function(service){
        let weekService = weekServices.findBy('item.id',service.get('item.id'));
        services.findBy('item.id',service.get('item.id')).set('leftFrequency',weekService.get('leftFrequency'));
      });
    }.observes('curdate','serviceList'),

    //新的护理计划表格
    //该老人的所属方案的周项目列表
    weekServiceList:Ember.computed('serviceList','planDone','allPlanDetailList.length',function(){
      let _self = this;
      let serviceList = this.get('serviceList');
      let projectList = this.get('projectList');
      if(!serviceList||!projectList){
        return null;
      }
      let project = projectList.findBy('customer.id',_self.get('customer.id'));
      let id = project.get('id');
      let list = new Ember.A();
      serviceList.forEach(function(service){
        if(service.get('project.id')==id&&service.get('period.typecode') == 'periodWeek'){
          service.set('weekPlan',true);
          list.pushObject(service);
        }
      });
      //取当周已安排的周项目
      let newCustomerPlanList = this.get('allPlanDetailList');
      if(newCustomerPlanList.get('length')>7){
        let weeklist = new Ember.A();
        for(let i=7;i<newCustomerPlanList.get('length');i++){
          weeklist.pushObject(newCustomerPlanList.objectAt(i));
        }
        list.forEach(function(service){
          service.set('chooseFrequency',0);
          weeklist.forEach(function(week){
            if(service.get('id')==week.get('item.id')){
              let num = week.get('weekCounts') || 0;
              service.set('chooseFrequency',num);
            }
          });
        });
      }
      return list;
    }),

    //该老人的所属方案的日项目列表
    dayServiceList:Ember.computed('serviceList','planDone','allPlanDetailList.length',function(){
      let _self = this;
      let serviceList = this.get('serviceList');
      let projectList = this.get('projectList');
      if(!serviceList||!projectList){
        return null;
      }
      let project = projectList.findBy('customer.id',_self.get('customer.id'));
      let id = project.get('id');
      let list = new Ember.A();
      serviceList.forEach(function(service){
        if(service.get('project.id')==id&&service.get('period.typecode') == 'periodDay'){
          list.pushObject(service);
        }
      });
      return list;
    }),

    //项目弹层的数据
    serviceDetailDate:Ember.computed('servList','curDate','planDone',function(){
      let _self = this;
      let customer = this.get('customer');
      let servList = this.get('servList');//当前的项目列表
      let timeIconList = this.get('timeIconList');
      let item = Ember.Object.create({});
      let year = this.get('curYear');
      let weekIndex = this.get('curWeek');
      let weekTab = this.get('curDate.weekTab');
      item.set('customer',customer);
      let serviceList = new Ember.A();
      if(!servList){
        return null;
      }
      servList.forEach(function(service){
        let item = Ember.Object.create({});
        item.set('item',service);
        item.set('weekPlan',service.get('weekPlan'));
        let list = new Ember.A();
        timeIconList.forEach(function(time){
          let item = _self.store.createRecord('nursingplandetail',{});
          item.set('yearTab',year);
          item.set('weekTab',weekTab);
          item.set('weekIndex',weekIndex);
          item.set('item',service);
          item.set('customer',customer);
          item.set('startTimeTab',time.get('order'));
          item.set('name',time.get('name'));
          item.set('icon',time.get('icon'));
          item.set('selected',false);
          list.pushObject(item);
        });
        item.set('dateList',list);
        item.set('chooseFrequency',0);
        if(service.get('weekPlan')){
          item.set('chooseFrequency',service.get('chooseFrequency')||0);
        }
        serviceList.pushObject(item);
      });
      item.set('serviceList',serviceList);
      return item;
    }),

    actions:{
      detailWeek(){
        if(this.get('editWeek')){
          this.set('editWeek',false);
        }else{
          this.set('editWeek',true);
        }
      },
      changeWeek(week){
        let weekNum = week.get('num');
        let totaldays = 7*weekNum;
        let year = this.get('curYear');
        let  days = new Array(12);
        days[0] = 31;
        days[2] = 31;
        days[3] = 30;
        days[4] = 31;
        days[5] = 30;
        days[6] = 31;
        days[7] = 31;
        days[8] = 30;
        days[9] = 31;
        days[10] = 30;
        days[11] = 31;
        if (Math.round(year / 4) == year / 4) {
            days[1] = 29;
        } else {
            days[1] = 28;
        }
        let months = new Array(12);
        months[0] = 31;
        for(let i=1;i<13;i++){
          months[i] = months[i-1] + days[i];
        }
        let month ;
        let day ;
        for(let i=0;i<12;i++){
          if((totaldays-months[i])<0){
            month = i + 1;
            day = days[i]+totaldays-months[i] -1;
            break;
          }
        }
        let date = new Date();
        date.setDate(day);
        date.setMonth(month-1);
        date.setFullYear(year);
        this.setDate(date);
        this.set('editWeek',false);
        this.send('queryPlan');
      },
      toTemplate(){
        let id = this.get('customer.id');
        let toTemplateFlag = this.get('toTemplateFlag');
        this.incrementProperty('toTemplateFlag');
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('plan-template',{customerId:id,toTemplateFlag:toTemplateFlag});
      },
      //页面内根据当前周重新请求数据
      queryPlan(){
        let _self = this;
        let customer = this.get('customer');
        let yearTab = this.get('curYear');
        let weekIndex =this.get('curWeek');
        this.get("global_ajaxCall").set("action","customer_plan");
        this.store.query('nursingplandetail',{filter:{cid:customer.get('id'),yearTab:yearTab,weekIndex:weekIndex}}).then(function(list){
          let newCustomerPlanList = new Ember.A();
          for(let i = 0 ; i<7;i++){
            newCustomerPlanList.pushObject(list.objectAt(i));
          }
          let serviceName = list.get('firstObject.remark').split('@');
          let allDayServiceName = serviceName[1];
          let allWeekServiceName = serviceName[0];
          if(allDayServiceName.length>0){
            _self.set('allDayServiceName',allDayServiceName);
          }else{
            _self.set('allDayServiceName','暂无');
          }
          if(allWeekServiceName.length>0){
            _self.set('allWeekServiceName',allWeekServiceName);
          }else{
            _self.set('allWeekServiceName','暂无');
          }
          _self.set('newCustomerPlanList',newCustomerPlanList);
          _self.set('allPlanDetailList',list);
        });
      },
      //上一周
      prevWeek(){
        let _self = this;
        let flag = this.get('flag');
        let currentFirstDate = this.get('currentFirstDate');
        console.log(_self.addDate(currentFirstDate,-7));//这行代码不能删
        this.setDate(_self.addDate(currentFirstDate,0));
        this.incrementProperty('flag',-1);
        this.send('queryPlan');
      },
      //下一周
      nextWeek(){
        let _self = this;
        let flag = this.get('flag');
        if(flag<3){
          let currentFirstDate = this.get('currentFirstDate');
          this.setDate(_self.addDate(currentFirstDate,7));
          this.incrementProperty('flag');
          this.send('queryPlan');
        }
      },
      //重置弹层
      detailCancel(){
        var _self = this;
        App.lookup('controller:business.mainpage').showConfirm("是否重置",function(){
          _self.send('cancelPassSubmit');
        });
      },
      //关闭老人弹层
      exitCustomer(){
        this.set('editCustomer',false);
      },
      //选择老人弹层
      editCustomer(){
        // this.set('editCustomer',true);
        var mainpageController = App.lookup('controller:business.mainpage');
        mainpageController.switchMainPage('nursing-template');
      },
      selectCustomer(customer){
        this.set('theCustomer',customer);
      },
      //选定要安排计划的老人
      come(){
        //判断该老人是否有计划模板，有模板的在当前页，没有模板的跳到模板页设置模板
        var _self = this;
        let customer = this.get('theCustomer');
        var mainpageController = App.lookup('controller:business.mainpage');
        this.set("curdate","");//set curdate 为空从新选择
        this.set('detailEdit',false);//不要编辑了 直接set为true
        // let params = {customerId : customer.get("id")};
        // this.store.query("nursingplanitem",{filter:{customer:{id:customer.get("id")}}}).then(function(planTemplateList){
        //   if(planTemplateList&&planTemplateList.get("length")>0){
        //     let weekIndex = _self.get("dateService").theWeek();
        //     let year = new Date().getYear();
        //     if(year<1000){
        //       year = year + 1900;
        //     }
        //
        //     _self.store.query('nursingplandetail',{filter:{"weekIndex@$gte":weekIndex,"weekIndex@$lte":weekIndex+4,"yearTab":year,customer:{id:customer.get('id')}}}).then(function(planItemList){
        //       _self.set('planItemList',planItemList);
        //     });
        //     _self.set('customer',customer);
        //     _self.set('curcustomerId',customer.get('id'));
        //     _self.set('editCustomer',false);
        //     _self.set('isSubmit',"disabled");
        //   }else {
        //     _self.set('editCustomer',false);
        //     _self.set('theCustomer','');
        //     mainpageController.switchMainPage('plan-template',params);
        //
        //   }
        // });
        let yearTab = this.get('curYear');
        let weekIndex = this.get("dateService").theWeek();
        Ember.run.schedule("afterRender",this,function() {
          _self.set('flag',-1);
          _self.setDate(new Date());
        });
        this.get("global_ajaxCall").set("action","customer_plan");
        this.store.query('nursingplandetail',{filter:{cid:customer.get('id'),yearTab:yearTab,weekIndex:weekIndex}}).then(function(list){
          let newCustomerPlanList = new Ember.A();
          for(let i = 0 ; i<7;i++){
            newCustomerPlanList.pushObject(list.objectAt(i));
          }
          _self.set('newCustomerPlanList',newCustomerPlanList);
          _self.set('customer',customer);
          _self.set('allPlanDetailList',list);
          _self.set('editCustomer',false);
        });

      },
      //项目编辑弹层
      detaiServiceDate(date,type){
        //查询老人当天的计划
        let _self = this;
        let customer = this.get('customer');
        let weekIndex = this.get('curWeek');
        let serviceType;
        this.set('curDate',date);
        this.set('curType',type);
        if(type=='week'){
          serviceType = 'periodWeek';
          this.set('servList',this.get('weekServiceList'));
        }
        if(type == 'day'){
          serviceType = 'periodDay';
          this.set('servList',this.get('dayServiceList'));
        }
        this.get("global_ajaxCall").set("action","");
        this.store.query('nursingplandetail',{filter:
          {customer:{id:customer.get('id')},weekIndex:weekIndex,weekTab:date.get('weekTab'),item:{period:{typecode:serviceType}}}})
          .then(function(planDetailList){
          _self.set('curPlanList',planDetailList);//当天的护理计划
          let serviceDetailDate = _self.get('serviceDetailDate');
          serviceDetailDate.get('serviceList').forEach(function(service){
            let planList = planDetailList.filter(function(plan){
              //当天该项目的计划
              return plan.get('item.id') == service.get('item.id');
            });
            if(planList){
              service.get('dateList').forEach(function(date){
                planList.forEach(function(plan){
                  if(plan.get('startTimeTab')==date.get('startTimeTab')){
                    //根据该项目当天你的安排。对应的时间设为已选
                    date.set('selected',true);
                    if(service.get('weekPlan')){
                      _self.get('weekServiceList').forEach(function(serv){
                        if(serv.get('id')==service.get('item.id')){
                          serv.set('chooseFrequency',service.get('chooseFrequency'));
                        }
                      });
                    }else{
                      let num = service.get('chooseFrequency');
                      num = num + 1;
                      service.set('chooseFrequency',num);
                    }
                  }
                });
              });
            }
          });
        });
        this.set('detailService',true);
        this.send('chooseTab',this.get('serviceDetailDate.serviceList.firstObject'));
      },
      //退出项目编辑
      exitServices(){
        this.set('editService',false);
        this.set('curdate',null);
        this.set('curDate',null);
        this.set('detailService',false);
        this.set('serviceFull',false);
      },
      //项目弹层标签选择
      chooseTab(service){
        let services = this.get('serviceDetailDate.serviceList');
        services.forEach(function(service){
          service.set('active',false);
        });
        service.set('active',true);
        this.set('chooseService',service);
      },
      //选择项目
      clickService(service){
        let _self = this;
        let chooseService = this.get('chooseService');
        if(service.get('selected')){
          if(chooseService.get('chooseFrequency')>0){
            service.set('selected',false);
            let serviceDetailDate = this.get('serviceDetailDate');
            let serv = serviceDetailDate.get('serviceList').findBy('item.id',chooseService.get('item.id'));
            serv.get('dateList').findBy('startTimeTab',service.get('startTimeTab')).set('selected',false);
            let num = chooseService.get('chooseFrequency') - 1;
            chooseService.set('chooseFrequency',num);
          }
        }else{
          if(chooseService.get('chooseFrequency')<chooseService.get('item.frequency')){
            service.set('selected',true);
            let serviceDetailDate = this.get('serviceDetailDate');
            let serv = serviceDetailDate.get('serviceList').findBy('item.id',chooseService.get('item.id'));
            serv.get('dateList').findBy('startTimeTab',service.get('startTimeTab')).set('selected',true);
            let num = chooseService.get('chooseFrequency') + 1;
            chooseService.set('chooseFrequency',num);
          }else{
            service.set('serviceFull',true);
            setTimeout(function(){
              service.set('serviceFull',false);
            },3000);
          }
        }

      },
      savenewServices(){
        let _self = this;
        let newPlan = this.store.createRecord('customernursingplan',{});
        let serviceDetailDate = this.get('serviceDetailDate');
        let list = new Ember.A();
        let customer = this.get('customer');
        let yearTab = this.get('curYear');
        let weekIndex =this.get('curWeek');
        let itemType = this.get('curType');
        let date = this.get('curDate');
        let weekTab = date.get('weekTab');
        serviceDetailDate.get('serviceList').forEach(function(service){
          service.get('dateList').forEach(function(serv){
            if(serv.get('selected')){
              list.pushObject(serv);
            }
          });
        });

        App.lookup('controller:business.mainpage').openPopTip("正在保存");
        newPlan.set('weekTab',weekTab);
        newPlan.set('itemType',itemType);
        newPlan.set('yearTab',yearTab);
        newPlan.set('weekIndex',weekIndex);
        newPlan.set('customers',customer.get('id'));
        newPlan.set('details',list);
        _self.set('detailService',false);
        newPlan.save().then(function(){
          _self.get("global_ajaxCall").set("action","customer_plan");
          _self.store.query('nursingplandetail',{filter:{cid:customer.get('id'),yearTab:yearTab,weekIndex:weekIndex}}).then(function(list){
            let newCustomerPlanList = new Ember.A();
            for(let i = 0 ; i<7;i++){
              newCustomerPlanList.pushObject(list.objectAt(i));
            }
            let serviceName = list.get('firstObject.remark').split('@');
            let allDayServiceName = serviceName[1];
            let allWeekServiceName = serviceName[0];
            if(allDayServiceName.length>0){
              _self.set('allDayServiceName',allDayServiceName);
            }else{
              _self.set('allDayServiceName','暂无');
            }
            if(allWeekServiceName.length>0){
              _self.set('allWeekServiceName',allWeekServiceName);
            }else{
              _self.set('allWeekServiceName','暂无')
            }
            _self.set('newCustomerPlanList',newCustomerPlanList);
            _self.set('allPlanDetailList',list);
            App.lookup('controller:business.mainpage').showPopTip("保存成功");
            _self.set('curDate',null);
          });
        },function(err){
          App.lookup('controller:business.mainpage').showPopTip("保存失败",false);
          let error = err.errors[0];
          if(error.code==='11'){
            App.lookup('controller:business.mainpage').showAlert('只能修改今天之后的护理计划！');
          }
        });
      }
    }

});
