import Ember from 'ember';

export default Ember.Controller.extend({
  queryScheduled:true,
  queryAll:false,
  dateService: Ember.inject.service("date-service"),
  dataLoader:Ember.inject.service("data-loader"),
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
  init(){
    this.set('queryScheduled',true);
    this.set('queryAll',false);
  },
  constants: Constants,
  queryCondition:'',
  mainController: Ember.inject.controller('business.mainpage'),
  exportAll:true,
  actions:{
    delDetail(flow){
      console.log('取消预定');
      let _self = this;
      this.set('delModel',true);
      this.set('curFlow',flow);
    },
    invitation(){
      this.set('delModel',false);
    },
    cancelPassSubmit(){
      let flow = this.get('curFlow');
      let _self = this;
      let status = this.get("dataLoader").findDict("orderStatusQX");
      flow.set('orderStatus',status);
      flow.save().then(function(){
        App.lookup('controller:business.mainpage').showPopTip('取消预定成功');
        _self.set('delModel',false);
        var route = App.lookup('route:business.mainpage.business-customer');
        App.lookup('controller:business.mainpage').refreshPage(route);

      });
    },
    exportToAllExcel(){
      let _self = this;
      let params = App.lookup("route:business.mainpage.business-customer").buildQueryParams();
      App.lookup("route:business.mainpage.business-customer").set('perPage',9999);
      App.lookup("route:business.mainpage.business-customer").findPaged('customerbusinessflow',params).then(function(customerbusinessflowList){
          _self.set('exportList',customerbusinessflowList);
          Ember.run.schedule('afterRender',function(){
            $(".export-block").tableExport({type:'excel',escape:'false'});
          });
      });
    },
    toDetailPage(){
        this.get("mainController").switchMainPage('direct-check',{target:"toScheduled",editMode:'add',from:'scheduled',id:''});
    },
    toDetail(flow){
      this.get("mainController").switchMainPage('direct-check',{target:"toScheduled",id:flow.get('id'),editMode:'read',from:'scheduled'});
    },
    toEdit(flow){
      let status = flow.get('status.typecode');
      if(status=='consultStatus3'){
        this.get("mainController").switchMainPage('try-customer',{editMode:"edit",id:flow.get('id')});
      }
      if(status=='consultStatus4'){
        this.get("mainController").switchMainPage('checkin-customer',{editMode:"edit",id:flow.get('id')});
      }
    },
    toCheckIn(flow){
      this.get("mainController").switchMainPage('checkin-customer',{editMode:"edit",id:flow.get('id')});
    },
    search(flag){
      this.set("timeCondition", flag);
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.business-customer").doQuery();
    },
    //时间选择器确定
    submmit(){
      this.set('dateShow', false);
      this.set("timeCondition", 'flag');
      App.lookup("route:business.mainpage.business-customer").doQuery();
    },
    //清空时间
    emptied(){
      this.set("beginDate", null);
      this.set("endDate", null);
      this.set("timeCondition", null);
      this.set('dateShow', false);
      App.lookup("route:business.mainpage.business-customer").doQuery();
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
    //咨询转预定弹层
    consultation(){
      let _self = this;
      this.set('toScheduled',true);
      this.store.query('consultinfo',{filter:{consultStatus:{'typecode@$not':"consultStatus3"}}}).then(function(consultList){
        _self.set('consultList',consultList);
        _self.set('allconsultList',consultList);
      });
    },
    searchConsult(){
      let consult = this.get('consult');
      let allconsultList = this.get('allconsultList');
      if(consult){
        let list = allconsultList.filter(function(cons){
          return cons.get('advName').indexOf(consult) != -1 || cons.get('advTel').toString().indexOf(consult) != -1 ;
        });
        this.set("consultList",list);
      }else{
        this.set('consultList',allconsultList);
      }
    },
    //关闭弹层
    noScheduled(){
      this.set('toScheduled',false);
    },
    //咨询转预定
    jumpAdvance(consult){
      this.set('toScheduled',false);
      this.get("mainController").switchMainPage('consultation-advance', {editMode:'add',
      consultId:consult.get("id")
      });
    },
    //查询已预订
    queryScheduled(){
      App.lookup("route:business.mainpage.business-customer").doQuery();
      this.set('queryAll',false);
      this.set('queryScheduled',true);
    },
    //查询全部
    queryAll(){
      App.lookup("route:business.mainpage.business-customer").doQueryAll();
      this.set('queryAll',true);
      this.set('queryScheduled',false);
    }
  }
});
