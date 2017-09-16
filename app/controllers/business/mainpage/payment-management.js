import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition:'',
    searchInput:'',
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

    actions:{
      //跳转至编辑页
      toDetailPage(trade){
        if(trade){
          let id=trade.get('id');
          this.get("mainController").switchMainPage('payment-detail',{id:id,editMode:"edit"});
        }else{
          this.get("mainController").switchMainPage('payment-detail',{editMode:"add"});
        }

      },
      search(flag){
        this.set("timeCondition", flag);
        this.set("beginDate", null);
        this.set("endDate", null);
        this.set('dateShow', false);
        App.lookup("route:business.mainpage.payment-management").doQuery();
      },
      //时间选择器确定
      submmit(){
        this.set('dateShow', false);
        this.set("timeCondition", 'flag');
        App.lookup("route:business.mainpage.payment-management").doQuery();
      },
      //清空时间
      emptied(){
        this.set("beginDate", null);
        this.set("endDate", null);
        this.set("timeCondition", null);
        this.set('dateShow', false);
        App.lookup("route:business.mainpage.payment-management").doQuery();
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
      dpShowAction(e){

      },
    }

});
