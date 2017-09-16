import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service("date-service"),
  constants: Constants,
  queryCondition:'',
  exportAll:true,
  mainController: Ember.inject.controller('business.mainpage'),
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
    exportToAllExcel(){
      let _self = this;
      let params = App.lookup("route:business.mainpage.try-and-stay").buildQueryParams();
      App.lookup("route:business.mainpage.try-and-stay").set('perPage',9999);
      App.lookup("route:business.mainpage.try-and-stay").findPaged('customerbusinessflow',params).then(function(customerbusinessflowList){
          _self.set('exportList',customerbusinessflowList);
          Ember.run.schedule('afterRender',function(){
            $(".export-block").tableExport({type:'excel',escape:'false'});
          });
      });
    },
    toDetailPage(){
        this.get("mainController").switchMainPage('scheduled',{editMode:"add",id:''});
    },
    //进入详情页
    toDetail(flow){
      // let status = flow.get('status.typecode');
      // if(status=='consultStatus4'){
      //   this.get("mainController").switchMainPage('try',{editMode:"edit",id:flow.get('id'),from:'try'});
      // }
      // if(status=='consultStatus5'){
      //   this.get("mainController").switchMainPage('checkin',{editMode:"edit",id:flow.get('id'),from:'try'});
      this.get("mainController").switchMainPage('direct-check',{target:"toDetail",id:flow.get('id'),editMode:'read'});
      // }
    },
    //试住转入住
    toCheckIn(flow,model){
      this.set('tryandstay',false);
      this.get("mainController").switchMainPage('direct-check',{target:"toCheckIn",id:flow.get('id'),from:model,editMode:'add'});
    },
    toEdit(flow){
      this.set('tryandstay',false);
      this.get("mainController").switchMainPage('try-customer',{editMode:"edit",id:flow.get('id')});
    },
    search(flag){
      this.set("timeCondition", flag);
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.try-and-stay").doQuery();
    },
    //时间选择器确定
    submmit(){
      this.set('dateShow', false);
      this.set("timeCondition", 'flag');
      App.lookup("route:business.mainpage.try-and-stay").doQuery();
    },
    //清空时间
    emptied(){
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("timeCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.try-and-stay").doQuery();
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
    //直接入住
    toStay(){
      this.get("mainController").switchMainPage('direct-check',{target:'direct',editMode:'add'});
    },
    //预定转入住
    tryAndStay(){
      let _self = this;
      this.set('tryandstay',true);
      let filter = {};
      filter =  {
        'status---1':{'typecode@$or1---1':'consultStatus4'},
        'status---2':{'typecode@$or1---2':'consultStatus3'},
        'backRemark':'in',

      };
      this.store.query('customerbusinessflow',{filter:{status:{typecode:'consultStatus3'},'orderStatus':{'typecode':'orderStatus1'}},sort:{createDateTime:'desc'}}).then(function(allList){
        _self.set('allList',allList);
        _self.set('scheduledList',allList);
      });
    },
    noTry(){
      this.set('tryandstay',false);
    },
    searchScheduled(){
      let scheduled = this.get('scheduled');
      let _self = this;
      if(scheduled){
        let scheduledList = this.get('allList');
        let list = scheduledList.filter(function(sche){
          if(sche.get('customer.phone')){
            return sche.get('customer.name').indexOf(scheduled) != -1 || sche.get('customer.phone').toString().indexOf(scheduled) != -1 ;
          }else{
            return sche.get('customer.name').indexOf(scheduled) != -1 ;
          }

        });
        this.set("scheduledList",list);
      }else{
        this.set('scheduledList',_self.get('allList'));
      }
    }
  }
});
