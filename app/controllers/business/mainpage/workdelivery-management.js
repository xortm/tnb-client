import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
    //queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
    chooseDate:Ember.computed('showStartDate','showEndDate','timeConditionSend',function(){
      if(this.get('timeConditionSend')){
        let timeCondition = this.get('timeConditionSend');
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
    chooseDate2:Ember.computed('showStartDateR','showEndDateR','timeConditionReceive',function(){
      if(this.get('timeConditionReceive')){
        let timeCondition = this.get('timeConditionReceive');
        if(timeCondition == 'today'){
          return '今天';
        }else if(timeCondition == 'seven'){
          return '最近7天';
        }else if(timeCondition == 'thirty'){
          return '最近30天';
        }else{
          if(this.get('showStartDateR')&&this.get('showEndDateR')){
            return this.get('showStartDateR')+'至'+this.get('showEndDateR');
          }else{
            return '选择日期';
          }

        }

      }else{
        return '选择日期';
      }
    }),
    defaultCustomer: Ember.computed('sendStaff', function() {
        return this.get('sendStaff');
    }),
    defaultCustomer2: Ember.computed('receiveStaff', function() {
        return this.get('receiveStaff');
    }),
    // customerList:Ember.computed('nursingList',function(){
    //
    //   let nursingList = this.get('nursingList');
    //   let list = new Ember.A();
    //   if(nursingList){
    //     nursingList.forEach(function(project){
    //       let c = Ember.Object.create({
    //         id:project.get('nurscustomer.id'),
    //         name:project.get('nurscustomer.name'),
    //         sortName:pinyinUtil.getFirstLetter(project.get('nurscustomer.name')),
    //       });
    //       list.pushObject(c);
    //     });
    //
    //   }
    //   console.log("就是他   ", list);
    //   return list;
    // }),


    actions: {
        dpShowAction(e) {},
        toDetailPage(data) {
            if (data) {
                let id = data.get('id');
                console.log("++++++++id++++++++++++++++**********", id);
                this.get("mainController").switchMainPage('workdelivery-detail-pc', {
                    id: id,
                    editMode: "edit"
                });
            }
        },
        selectSendStaff(staff){
          this.set('sendStaff',staff);
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        selectReceiveStaff(staff){
          this.set('receiveStaff',staff);
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        search(flag){
          this.set("timeConditionSend", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        search2(flag){
          this.set("timeConditionReceive", flag);
          this.set("beginDateR", null);
          this.set("endDateR", null);
          this.set('dateShowR', false);
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("timeConditionSend", 'flag');
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        submmit2(){
          this.set('dateShowR', false);
          this.set("timeConditionReceive", 'flag');
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        //清空时间
        emptiedSend(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("timeConditionSend", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        emptiedReceive(){
          this.set("beginDateR", null);
          this.set("endDateR", null);
          this.set("timeConditionReceive", null);
          this.set('dateShowR', false);
          App.lookup("route:business.mainpage.workdelivery-management").doQuery();
        },
        changeReceiveBeginDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("beginDateR",date);
            this.set('showStartDateR',stamp);
        },
        changeReceiveEndDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("endDateR",date);
            this.set('showEndDateR',stamp);
        },
        changeSendBeginDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("beginDate",date);
            this.set('showStartDate',stamp);
        },
        changeSendEndDateAction(date) {
            var stamp=this.get("dateService").dateFormat(date,"yyyy-MM-dd");
            this.set("endDate",date);
            this.set('showEndDate',stamp);
        },

    }
});
