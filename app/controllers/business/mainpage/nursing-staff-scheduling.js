import Ember from 'ember';

export default Ember.Controller.extend({
  constants: Constants,
  hasChooseStaffs:true,
  flag:0,
  change:0,
  feedBus: Ember.inject.service("feed-bus"),
  isPaste:0,

  detailEdit:true,
  dateService: Ember.inject.service("date-service"),
  mainController: Ember.inject.controller('business.mainpage'),
  workDate:Ember.computed('curdate.@each.workList.@each.seq',function(){
    let curdate = this.get('curdate');
    let workDate = Ember.Object.create({});
    let workList = new Ember.A();
    curdate.get('workList').forEach(function(work){
      let item = Ember.Object.create({});
      item.set('seq',work.get('seq'));
      item.set('workTimeSetting',work.get('workTimeSetting'));
      item.set('hasSelected',work.get('hasSelected'));
      workList.pushObject(item);
    });
    workDate.set('workList',workList);
    return workDate;
  }),
  delList:Ember.computed(function(){
    return new Ember.A();
  }),
  copyList:Ember.computed(function(){
    return new Ember.A();
  }),
  chooseWorkList:Ember.computed('staffList','staffschedules','chooseFlag',function(){
    let staffList = this.get('staffList');
    let schedules = this.get('staffschedules');
    let list = new Ember.A();
    //查询所有已选护工的排班信息
    if(staffList){
      if(schedules){
        schedules.forEach(function(schedule){
          //将得到的所有排班信息数据格式化，放入数组中
          if(staffList.findBy('id',schedule.get('employee.id'))){
            let weekIndex = schedule.get('weekIndex');
            let week = schedule.get('week');
            let num = schedule.get('employee.id')*100000 + schedule.get('workTimeSetting.id')*11111 + Number(week)*1000 + Number(weekIndex)*100 + Number(week) ;
            schedule.set('seq',num);
            list.pushObject(schedule);
          }
        });
      }
    }
    console.log('chooseWorkList length:',list.get('length'));
    return list;
  }),
  chooseWorkListObs:function(){
    let staffList = this.get('staffList');
    let schedules = this.get('staffschedules');
    let list = new Ember.A();
    //查询所有已选护工的排班信息
    if(staffList){
      if(schedules){
        schedules.forEach(function(schedule){
          //将得到的所有排班信息数据格式化，放入数组中
          if(staffList.findBy('id',schedule.get('employee.id'))){
            let weekIndex = schedule.get('weekIndex');
            let week = schedule.get('week');
            let num = schedule.get('employee.id')*100000 + schedule.get('workTimeSetting.id')*11111 + Number(week)*1000 + Number(weekIndex)*100 + Number(week);
            schedule.set('seq',num);
            list.pushObject(schedule);
          }
        });
      }
    }
    console.log('chooseWorkList length:',list.get('length'));
    this.set('chooseWorkList',list);
  }.observes('staffschedules'),
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

  //被复制的周列表
  copyWeekList:Ember.computed('curWeek','copyToWeek',function(){
    let week = this.get('curWeek');
    let copyToWeek = this.get('copyToWeek');
    let list = new Ember.A();
    let yugi = function(year) {
      let d = new Date(year, 0, 1);

      let to = new Date(year + 1, 0, 0);
      let i = 1;
      for (let from = d; from < to;) {
        let item = Ember.Object.create({});
        let firstDay,endDay;
          firstDay =  i + "周 (" + (from.getMonth() + 1) + "/" + (from.getDate()) + " - " ;
          from.setDate(from.getDate() + 6);
          if (from < to) {
              from.setDate(from.getDate() + 1);
              endDay = (from.getMonth() + 1) + "/" + (from.getDate() - 1) + ")";
          } else {
              to.setDate(to.getDate() - 1);
              endDay = (to.getMonth() + 1) + "/" + to.getDate() + ")";
          }
          i++;
          let text = firstDay + endDay ;
          item.set('text',text);
          item.set('week',i);
          if(!copyToWeek){
            list.pushObject(item);
          }else{
            if(copyToWeek.get('week')!==i){
              list.pushObject(item);
            }
          }

      }
    };
    yugi(2017);
    return list;
  }),
  //复制的周列表里
  copyToWeekList:Ember.computed('curWeek','copyWeek',function(){
    let week = this.get('curWeek');
    let list = new Ember.A();
    let copyWeek = this.get('copyWeek');
    let yugi = function(year) {
      let d = new Date(year, 0, 1);
      let to = new Date(year + 1, 0, 0);
      let i = 1;
      for (let from = d; from < to;) {
        let item = Ember.Object.create({});
        let firstDay,endDay;
          firstDay = i + "周 (" + (from.getMonth() + 1) + "/" + (from.getDate()) + " - " ;
          from.setDate(from.getDate() + 6);
          if (from < to) {
              from.setDate(from.getDate() + 1);
              endDay = (from.getMonth() + 1) + "/" + (from.getDate() - 1) + ")";
          } else {
              to.setDate(to.getDate() - 1);
              endDay = (to.getMonth() + 1) + "/" + to.getDate() + ")";
          }
          i++;
          let text = firstDay + endDay ;
          item.set('text',text);
          item.set('week',i);
          if(i>week+1){
            if(copyWeek.get('week')!==i){
              list.pushObject(item);
            }
          }
      }
    };
    yugi(2017);
    return list;
  }),

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
    this.set('curYear',date.getFullYear());
    this.set('curMonth',date.getMonth()+1);
    this.set('curDay',date.getDate());
    this.set('curWeek',week);
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
  //所有护理人员列表，包括护工组和未编组护工
  allStaffList:Ember.computed('staffs','groups',function(){
    let staffs = this.get('staffs');
    let groups = this.get('groups');
    let list = new Ember.A();
    if(!groups){
      return null;
    }
    if(!staffs){
      return null;
    }
    groups.forEach(function(group){
      group.set('type','group');
      group.set('hasSelected',false);
      group.set('group',true);
      list.pushObject(group);
    });
    staffs.forEach(function(staff){
      staff.set('hasSelected',false);
      staff.set('type','staff');
      list.pushObject(staff);
    });
    return list;
  }),
  //选定要排班的护理人员
  chooseStaffs:Ember.computed('allStaffList.@each.hasSelected',function(){
    let allStaffList = this.get('allStaffList');
    if(!allStaffList){
      return null;
    }
    return allStaffList.filter(function(staff){
      return staff.hasSelected===true;
    });
  }),
  //员工请假列表
  staffLeaveList:Ember.computed('staffList','currentFirstDate',function(){
    let _self = this;
    //1、员工ID集合
    let staffList = this.get('staffList');
    let staffIds = '';
    staffList.forEach(function(staff){

      staffIds += staff.get('id') + ',';
    });
    staffIds = staffIds.substring(0,staffIds.length-1);
    //当周第一秒和最后一秒
    let currentFirstDate = this.get('currentFirstDate');
    if(!currentFirstDate){
      return ;
    }
    let nowDay = currentFirstDate.getDate(); //当前日
    let nowMonth = currentFirstDate.getMonth(); //当前月
    let nowYear = currentFirstDate.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0;
    var nowDayOfWeek = currentFirstDate.getDay(); //当前周几
    let weekStartDate =  new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
    let firstDay = formatDate(weekStartDate);
    let firstDaySecond = this.get('dateService').getFirstSecondStampOfDayString(firstDay);
    let lastDaySecond = firstDaySecond + 604799;
    //请求该周员工请假列表
    this.store.query('employee-leave-flow',{filter:{staffIds:staffIds,startTime:firstDaySecond,endTime:lastDaySecond}}).then(function(list){
      let leaveList = new Ember.A();
      list.forEach(function(data){
        let arr = data.get('leaveDay').split(',');
        for(let i=0;i<arr.length;i++){
          let item = Ember.Object.create({});
          item.set('staff',data.get('applicant'));
          if(arr[i]==7){
            item.set('leaveDay',0);
          }else{
            item.set('leaveDay',arr[i]);
          }

          leaveList.pushObject(item);
        }
      });
      _self.set('leaveList',leaveList);
    })
  }),

  //排班表
  schedulingList:Ember.computed('leaveList','dayList','weekList','staffList','staffschedules','isPaste','chooseWorkList','workList','delList','flag','curWeek',function(){
    let _self = this;
    let flag = this.get('flag');
    let staffList = new Ember.A();
    let list = new Ember.A();
    let dayList = this.get('dayList');
    let weekList = this.get('weekList');
    let workList = this.get('workList');
    let chooseWorkList = this.get('chooseWorkList');
    let curWeek = this.get('curWeek');
    let copyToWeek = this.get('copyToWeek');
    let schedules = this.get('staffschedules');
    let delList = this.get('delList');
    let leaveList = this.get('leaveList');
    if(!workList){
      return null;
    }
    if(!this.get('staffList')){
      schedules.forEach(function(schedule){
        //将所有的护工选出，放入stafflist
        if(!staffList.findBy('id',schedule.get('employee.id'))){
          staffList.pushObject(schedule.get('employee'));
        }
        //格式化已有的排班数据，放入list
        let week = schedule.get('week');
        let weekIndex = schedule.get('weekIndex');
        let num = schedule.get('employee.id')*100000 + schedule.get('workTimeSetting.id')*11111 + Number(week)*1000 + Number(weekIndex)*100 + Number(week) ;
        schedule.set('seq',num);
        if(delList.get('length')===0){
          if(!chooseWorkList.findBy('seq',num)){
            chooseWorkList.pushObject(schedule);
          }
        }
      });
    }else{
      staffList = this.get('staffList');
    }
    staffList.forEach(function(staff){
      let dateList = new Ember.A();
      weekList.forEach(function(week){
        let item = Ember.Object.create({});
        let wlist = new Ember.A();
        workList.forEach(function(work){
          let item = _self.store.createRecord('staffschedule',{});
          let day = dayList.findBy('order',week.get('order')).get('day');
          let month = dayList.findBy('order',week.get('order')).get('month');
          let num = staff.get('id')*100000 + work.get('id')*11111 + week.get('order')*1000 + curWeek*100 + week.get('order');
          item.set('seq',num);
          item.set('employee',staff);
          item.set('workTimeSetting',work);
          item.set('week',week.get('order'));
          item.set('day',day);
          item.set('month',month);
          item.set('year',dayList.findBy('order',week.get('order')).get('year'));
          item.set('weekIndex',curWeek);
          item.set('hasSelected',false);
          if(chooseWorkList){
            if(chooseWorkList.findBy('seq',num)){
              item.set('hasSelected',true);
            }
          }
          wlist.pushObject(item);
        });
        item.set('workList',wlist);
        let workAllName = '';
        item.get('workList').forEach(function(work){
          if(work.get('hasSelected')){
            workAllName += work.get('workTimeSetting.name') + ',';
          }
        });
        item.set('workAllName',workAllName.substring(0,workAllName.length-1));
        item.set('week',week.get('order'));
        //该员工的请假记录
        if(leaveList){
          let staffLeaves = leaveList.filter(function(leave){
            return leave.get('staff.id') == staff.get('id');
          });
          if(staffLeaves){
            staffLeaves.forEach(function(leave){
              //当周某天请假，设置请假状态
              if(leave.get('leaveDay')==week.get('order')){
                item.set('leaving',true);
              }
            });
          }
        }
        dateList.pushObject(item);
      });
      staff.set('dateList',dateList);
      if(!dateList){
        return null;
      }
    });
    return staffList;
  }),

  actions:{
    //打印
    printImg(){
      $("<iframe ></iframe>", { id: 'myiframe'  }).bind('load', function(event) {

          if (!this.contentWindow) {
              return;
          }

          let scripWidthCode = document.createElement('script');
          scripWidthCode.type ='text/javascript';
          scripWidthCode.innerText = 'let ad_unit="123";';

          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(scripWidthCode);

          let scripWidthSrc = document.createElement('script');
          scripWidthSrc.type ='text/javascript';
          scripWidthSrc.src = 'http://abc.com/abc.js';

          let cssSrc = document.createElement('link');
          cssSrc.rel ='stylesheet';
          cssSrc.href = 'assets/images/print.css';

          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(scripWidthSrc);
          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(cssSrc);
          setTimeout(function(){
            let bdhtml=window.document.body.innerHTML;
            let sprnstr="<!--startprint-->";
            let eprnstr="<!--endprint-->";
            let prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
            prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
            $('#myiframe').contents().find('body').html(prnhtml);
            document.getElementById('myiframe').contentWindow.print();
            $('#myiframe').remove();
          },1000)

      }).appendTo('body');
    },
    exportToExcel(){
      $(".export-block").tableExport({type:'excel',escape:'false'});
    },
    nav(nav){
      let title = document.getElementsByClassName('breadcrumb')[0];
      let title2 = title.getElementsByTagName('li')[2];
      if(title2){
        title2.innerText = '排班选择';
      }

    },
    //选择被复制周
    selectCopyWeek(week){
      this.set('copyWeek',week);
    },
    //选择复制周
    selectCopyToWeek(week){

      if(!week){
        this.set('copyToWeek',new Ember.A());
      }else{
        this.set('copyToWeek',week);
      }
    },
    //复制排班表
    pasteWorkList(copy){
      let isPaste = this.get('isPaste');
      if(isPaste===0){
        let _self = this;
        let staffs = this.get('staffList');
        let ids = '';
        staffs.forEach(function(staff){
          ids += staff.get('id') + ',' ;
        });
        if(this.get('copyToWeek')){
          let copyToWeek = this.get('copyToWeek.week') - 1;
          let copyWeek = this.get('copyWeek.week') - 1;
          let staffworktimesetting = this.store.createRecord('staffworktimesetting',{});
          staffworktimesetting.set('staffs',ids.substring(0,ids.length-1));
          staffworktimesetting.set('target',copyToWeek);
          staffworktimesetting.set('resource',copyWeek);
          staffworktimesetting.save().then(function(){
            App.lookup('controller:business.mainpage').showPopTip("复制排班");
            // _self.set('detailEdit',false);
            let route = App.lookup('route:business.mainpage.nursing-staff-scheduling');
            App.lookup('controller:business.mainpage').refreshPage(route);
            App.lookup('controller:business.mainpage').showPopTip("复制成功");
          });
        }else{
          App.lookup('controller:business.mainpage').showAlert('还没有选择复制周');
        }
      }else{
        App.lookup('controller:business.mainpage').showAlert('请先保存所做的修改');
      }


    },
    //周选择弹层
    detailWeek(){
      if(this.get('editWeek')){
        this.set('editWeek',false);
      }else{
        this.set('editWeek',true);
      }
    },
    //选择周
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
    },
    //编辑按钮
    detailEditClick(){
      this.set('detailEdit',true);
      this.set('staffList','');//set 以前选择员工为空
    },

    //选择护工弹层
    editWork(){
      this.set('editStaff',true);
    },
    //选择护工弹层取消
    exitStaff(){
      let allStaffList = this.get('allStaffList');
      if(allStaffList){
        allStaffList.forEach(function(staff){
          staff.set('hasSelected',false);
        });
      }

      this.set('editStaff',false);

    },
    //排班
    chooseWork(work,date){
      let list1 = new Ember.A();
      date.get('workList').forEach(function(work){
        if(work.get('hasSelected')){
          list1.pushObject(work);
        }
      });
      if(work.get('hasSelected')){
        work.set('hasSelected',false);
      }else{
        if(list1.get('length')>=3){
          App.lookup('controller:business.mainpage').showAlert('每人最多安排3个班次！');
        }else{
          work.set('hasSelected',true);
        }
      }
      this.get('workDate').set('workList',date.get('workList'));
      this.send('determine',date);
    },
    //确定排班
    determine(date){
      let curdate = this.get('curdate');
      let delList = this.get('delList');
      let workDate = this.get('workDate');
      let _self = this;
      let hasWorkList = new Ember.A();
      let chooseWorkList = this.get('chooseWorkList');
      workDate.get('workList').forEach(function(work){
        if(work.get('hasSelected')){
          hasWorkList.pushObject(work);
          if(!chooseWorkList.findBy('seq',work.get('seq'))){
            let w = curdate.get('workList').findBy('seq',work.get('seq'));
            chooseWorkList.pushObject(w);
          }
        }else{
          if(chooseWorkList.findBy('seq',work.get('seq'))){
            date.get('workList').findBy('seq',work.get('seq')).set('hasSelected',false);
            let item = chooseWorkList.findBy('seq',work.get('seq'));
            item.set('delStatus',1);
            delList.pushObject(item);
            chooseWorkList.removeObject(chooseWorkList.findBy('seq',work.get('seq')));
          }
        }
      });
      this.set('chooseWorkList',chooseWorkList);
      // this.incrementProperty('isPaste');
    },
    //排班弹层
    detaiDate(date,staff){
       let _self = this;
      if(date&&staff){
        if(this.get('curdate')){
          this.get('schedulingList').forEach(function(staff){
            staff.get('dateList').forEach(function(date){
              date.set('hasChoosed',false);
            });
          });
        }
        if(this.get('curdate')==date){
          this.set('curdate',null);
          date.set('hasChoosed',false);
          this.set('detailWork',false);
        }else{
          date.set('staff',staff);
          this.set('curdate',date);
          date.set('hasChoosed',true);
          this.set('detailWork',true);
        }
      }else{
        if(!this.get('editDateMode')){
          this.set('curdate',null);
          date.set('hasChoosed',false);
          this.set('detailWork',false);
        }
      }
    },
    editDate(type){
      if(type=='in'){
        this.set('editDateMode',true);
      }else{
        this.set('editDateMode',false);
      }
    },
    invitation(){
      // this.set('detailWork',false);
      // this.get('curdate').set('hasChoosed',false);
      // this.set('curdate',null);
    },
    closePop(){
      let _self = this;
      let work = document.getElementById('work-pop');
      if(work){
        _self.get('curdate').set('hasChoosed',false);
        _self.set('curdate',null);
        _self.set('detailWork',false);
      }
    },
    //选择要排班的人
    chooseStaff(staff){
      staff.set('hasSelected',true);
    },
    //移除要排班的人
    chooseStaffBack(staff){
      staff.set('hasSelected',false);
    },
    //确定要排班的人
    come(){
      let _self = this;
      let chooseStaffs = this.get('chooseStaffs');
      let list = new Ember.A();
      //选中的所有护工组
      let groupList = chooseStaffs.filter(function(staff){
        return staff.get('type')=='group';
      });
      //选中的所有护工
      let employeeList = chooseStaffs.filter(function(staff){
        return staff.get('type')=='staff';
      });
      //将护工放入一个数组
      employeeList.forEach(function(staff){
        list.pushObject(staff);
      });
      //当有选择的护工组时，根据护工组查出该护工组的所有护工
      if(groupList.get('length')!==0){
        //根据所选择的护工组，组成查询条件
        let filter = {};
        for(let i=0;i<groupList.length;i++){
              let j = i+1;
              let key = "group][id@$or1---"+j;
              let value = groupList.objectAt(i).get('id');
              let filterNew = {};
              filterNew[key] = value;
              filter = $.extend({},filter, filterNew);
          }
        _self.store.query('employeenursinggroup',{filter}).then(function(staffs){
          staffs.forEach(function(staff){
            //将查询所得的所有护工放入数组
            if(!list.findBy('id',staff.get('employee.id'))){
              list.pushObject(staff.get('employee'));
            }
          });
          _self.set('staffList',list);
          _self.get('feedBus').set('workerList',list);
          let route = App.lookup('route:business.mainpage.nursing-staff-scheduling');
          App.lookup('controller:business.mainpage').refreshPage(route);
        });
      }else{
        _self.set('staffList',list);
        _self.get('feedBus').set('workerList',list);
      }

      this.set('editStaff',false);
      let allStaffList = this.get('allStaffList');
      allStaffList.forEach(function(staff){
        staff.set('hasSelected',false);
      });
      _self.set('hasChooseStaffs',true);
      Ember.run.schedule('afterRender',function(){
        _self.setDate(new Date());
      });

    },
    //保存排班表
    show(){
      let _self = this;
      let schedulingList = this.get('schedulingList');
      let list = new Ember.A();
      let delList = this.get('delList');
      App.lookup('controller:business.mainpage').openPopTip("正在保存");
      schedulingList.forEach(function(staff){
        staff.get('dateList').forEach(function(date){
          date.get('workList').forEach(function(work){
            if(work.get('hasSelected')){
              list.pushObject(work);
            }
          });
        });
      });
      let staffworktimesetting = this.store.createRecord('staffworktimesetting',{});
      let newlist = new Ember.A();
      if(delList.get('length')>0){
        newlist = this.get('chooseWorkList').pushObjects(delList);
      }else{
        newlist = this.get('chooseWorkList');
      }
      staffworktimesetting.set('schedules',newlist);
      staffworktimesetting.set('remark',0);
      staffworktimesetting.save().then(function(){
        let route = App.lookup('route:business.mainpage.nursing-staff-scheduling');
        // App.lookup('controller:business.mainpage').refreshPage(route);
        _self.store.query('staffschedule',{}).then(function(staffschedules){
          _self.set('staffschedules',staffschedules);
          _self.incrementProperty('chooseFlag');
          console.log('in ready');
          App.lookup('controller:business.mainpage').showPopTip("保存成功");

        });

      });
    },
    //下一周
    nextWeek(){
      this.send('selectCopyToWeek');
      let _self = this;
      let currentFirstDate = this.get('currentFirstDate');
      this.setDate(_self.addDate(currentFirstDate,7));
      let copyWeek = this.get('copyWeekList').findBy('week',_self.get('curWeek')+1);
      this.send('selectCopyWeek',copyWeek);
      this.incrementProperty('flag');
    },
    //上一周
    prevWeek(){
      this.send('selectCopyToWeek');
      let _self = this;
      let currentFirstDate = this.get('currentFirstDate');
      console.log(_self.addDate(currentFirstDate,-7));//这行代码不能删
      this.setDate(_self.addDate(currentFirstDate,0));
      let copyWeek = this.get('copyWeekList').findBy('week',_self.get('curWeek')+1);
      this.send('selectCopyWeek',copyWeek);
      this.incrementProperty('flag',-1);
    },
    //一键排班
    quick(date,staff){
      let list = new Ember.A();
      let delList = this.get('delList');
      let chooseWorkList = this.get('chooseWorkList');
      //本人当前的排班
      date.get('workList').forEach(function(work){
        if(work.get('hasSelected')){
          list.pushObject(work);
        }
      });
      //点击快速排班，将本人本周其他天按照今天排班
      let schedulingList = this.get('schedulingList');
      schedulingList.forEach(function(staffs){
        //找到本人的排班
        if(staffs.get('id')==staff.get('id')){
          staffs.get('dateList').forEach(function(date){
            date.get('workList').forEach(function(work){
              if(list.findBy('workTimeSetting.id',work.get('workTimeSetting.id'))){
                work.set('hasSelected',true);
                if(!chooseWorkList.findBy('seq',work.get('seq'))){
                  chooseWorkList.pushObject(work);
                }
              }else{
                work.set('hasSelected',false);
                if(chooseWorkList.findBy('seq',work.get('seq'))){
                  let item = chooseWorkList.findBy('seq',work.get('seq'));
                  item.set('delStatus',1);
                  delList.pushObject(item);
                  chooseWorkList.removeObject(work);
                }
              }
            });
          });
        }
      });
      this.set('chooseWorkList',chooseWorkList);
    },
    //重置弹层
    detailCancel(){
      let _self = this;
      App.lookup('controller:business.mainpage').showConfirm("是否重置",function(){
        _self.send('cancelPassSubmit');
      });
    },
    //重置
    cancelPassSubmit(){
      App.lookup('controller:business.mainpage').showPopTip('正在重置');
      this.get("mainController").switchMainPage('cs-home');
      this.get("mainController").switchMainPage('nursing-staff-scheduling');
      let route = App.lookup('route:business.mainpage.nursing-staff-scheduling');
      App.lookup('controller:business.mainpage').refreshPage(route);
      App.lookup('controller:business.mainpage').showPopTip('重置成功');
    },
  }
});
