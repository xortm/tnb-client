import Ember from 'ember';
export default Ember.Controller.extend({
    constants: Constants,
    mainController: Ember.inject.controller('business.mainpage'),
    dateService: Ember.inject.service("date-service"),
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
    defaultEmployee: Ember.computed('curEmployee', function() {
        return this.get('curEmployee');
    }),
    actions: {
        dpShowAction(e) {},
        selectEmployee(employee){
          this.set('curEmployee',employee);
          App.lookup("route:business.mainpage.staff-attendance-management").doQuery();
        },
        search(flag){
          this.set("timeCondition", flag);
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.staff-attendance-management").doQuery();
        },
        //时间选择器确定
        submmit(){
          this.set('dateShow', false);
          this.set("timeCondition", 'flag');
          App.lookup("route:business.mainpage.staff-attendance-management").doQuery();
        },
        //清空时间
        emptied(){
          this.set("beginDate", null);
          this.set("endDate", null);
          this.set("timeCondition", null);
          this.set('dateShow', false);
          App.lookup("route:business.mainpage.staff-attendance-management").doQuery();
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

    }
});
