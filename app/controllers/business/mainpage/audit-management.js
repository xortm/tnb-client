import Ember from 'ember';

export default Ember.Controller.extend({
    constants: Constants,
    queryCondition:'',
    mainController: Ember.inject.controller('business.mainpage'),
    dataLoader:Ember.inject.service('data-loader'),
    rechargeTab:true,
    billTab:false,
    dateService: Ember.inject.service("date-service"),
    chooseDate:Ember.computed('showStartDate','showEndDate','dateQueryCondition',function(){
      if(this.get('dateQueryCondition')){
        let dateQueryCondition = this.get('dateQueryCondition');
        if(dateQueryCondition == 'today'){
          return '今天';
        }else if(dateQueryCondition == 'seven'){
          return '最近7天';
        }else if(dateQueryCondition == 'thirty'){
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
      toDetailPage(bill,str){
        let id = bill.get('id');
        this.get("mainController").switchMainPage('audit-detail',{id:id,flag:str});
      },
      //
      auditBill(bill){
        this.set('showAudit',true);
        this.set('curBill',bill);
      },
      close(){
        this.set('showAudit',false);
      },
      passed(){
        let _self = this;
        let billInfo = this.get('curBill');
        if(billInfo.get('rechargeStatus')&&billInfo.get('rechargeStatus.typecode') == 'rechargeStatus1'){
          let status = this.get("dataLoader").findDict("rechargeStatus2");
          console.log('recharge status ',status);
          billInfo.set('rechargeStatus', status);
        }else{
          let status = this.get("dataLoader").findDict("billStatus2");
          billInfo.set('billStatus', status);
        }

        App.lookup('controller:business.mainpage').openPopTip("正在审核");
        billInfo.save().then(function() {
            _self.set('showAudit', false);
            App.lookup('controller:business.mainpage').showPopTip("审核成功");
            var route = App.lookup('route:business.mainpage.audit-management');
            App.lookup('controller:business.mainpage').refreshPage(route);

        },function(err){
          App.lookup('controller:business.mainpage').showPopTip("审核失败",false);
        });
      },
      chooseTab(str){
        if(str=='rechargeTab'){
          this.set('rechargeTab',true);
          this.set('billTab',false);
          App.lookup("route:business.mainpage.audit-management").doQueryRecharge();
        }
        if(str=='billTab'){
          this.set('rechargeTab',false);
          this.set('billTab',true);
          App.lookup("route:business.mainpage.audit-management").doQuery();
        }
      },
      search(flag){
        this.set("dateQueryCondition", flag);
        this.set("beginDate", null);
        this.set("endDate", null);
        this.set('dateShow', false);
        App.lookup("route:business.mainpage.audit-management").doQueryRecharge();
      },
      //时间选择器确定
      submmit(){
        this.set('dateShow', false);
        this.set("dateQueryCondition", 'flag');
        App.lookup("route:business.mainpage.audit-management").doQueryRecharge();
      },
      //清空时间
      emptied(){
        this.set("beginDate", null);
        this.set("endDate", null);
        this.set("dateQueryCondition", null);
        this.set('dateShow', false);
        App.lookup("route:business.mainpage.audit-management").doQueryRecharge();
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
