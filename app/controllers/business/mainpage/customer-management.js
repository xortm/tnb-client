import Ember from 'ember';

export default Ember.Controller.extend({
  dateService: Ember.inject.service("date-service"),
  store: Ember.inject.service("store"),
  doQueryFlag:0,
  idFlag:0,
  sizeFlag: null,//放大缩小标志
  paramList:null,
  chooseDate:Ember.computed('showStartDate','showEndDate','showBeginSeaconDate','showEndSeaconDate','seaconShow','endseaconShow','durTypeFlag',function(){
    var showStartDate=this.get('showStartDate');
    console.log('chooseDate:showStartDate',showStartDate);
    var showEndDate=this.get('showEndDate');
    console.log('chooseDate:showEndDate',showEndDate);
    var showBeginSeaconDate=this.get('showBeginSeaconDate');
    var showEndSeaconDate=this.get('showEndSeaconDate');
    console.log('chooseDate:showBeginSeaconDate',showBeginSeaconDate);
    var seaconShow=this.get('seaconShow');
    var endseaconShow=this.get('endseaconShow');
    let durType=null;
    let durTypeFlag=this.get('durTypeFlag');
    if(durTypeFlag=='year'){
      durType='年报';
    }
    if(durTypeFlag=='season'){
      durType='季报';
    }
    if(durTypeFlag=='mouth'){
      durType='月报';
    }
    if(durTypeFlag=='day'){
      durType='日报';
    }
    if(showStartDate&&showEndDate){
      return durType+':'+showStartDate+'-'+showEndDate;
    }else {
      if(!this.get('showBeginSeaconDate')||!this.get('showEndSeaconDate')){
        return '选择日期';
      }
    }
    if(this.get('showBeginSeaconDate')&&this.get('showEndSeaconDate')){
      return durType+':'+showBeginSeaconDate+':'+seaconShow+'-'+showEndSeaconDate+':'+endseaconShow;
    }
  }),
  computedParams:function(){
    //用户统计-查询条件(默认按用户分析)
    var customerAnalysisList=['statType18','statType19','statType20'];
    this.set('paramList',customerAnalysisList);
    this.set('paramShow','customerAnalysis');
    //默认时间(当月第一天第一分第一秒至当前时间)
    this.set('durTypeFlag','day');
    var momentTime=this.get("dateService").getCurrentTime();//当前时间戳
    var momentDate=this.get("dateService").timestampToTime(momentTime);//当前date时间
    var params2=parseInt(momentDate.getFullYear());//年份
    var params3=parseInt(momentDate.getMonth() + 1);//月份
    var momentBeginTime=this.get("dateService").getFirstSecondStampOfMonth(params2,params3);//当月的第一天第一分第一秒(时间戳)
    this.set('beginDate',momentBeginTime);
    this.set('endDate',momentTime);
    //计算 showStartDate和showEndDate
    this.set('showStartDate',momentDate.getFullYear()+'年'+params3+'月'+'1日');
    this.set('showEndDate',momentDate.getFullYear()+'年'+params3+'月'+momentDate.getDate()+'日');
    console.log('之前的标识是',this.get('doQueryFlag'));
    var doQueryFlag=this.get('doQueryFlag');
    doQueryFlag=++doQueryFlag;
    this.set('doQueryFlag',doQueryFlag);
    console.log('之后的标识是',this.get('doQueryFlag'));
  },
  actions: {
    bigClick(){
      this.set("sizeFlag","maxium");
    },
    customerAnalysisClick:function(customerAnalysis){//入住
      this.set('paramShow',customerAnalysis);//标识组件里面显示哪些图表
      var customerAnalysisList=['statType18','statType19','statType20'];//查询哪些统计类型
      this.set('paramList',customerAnalysisList);
    },
    submmit(durTypeFlag,beginseaconFlag,endseaconFlag,showStartDate,showEndDate,beginDate,endDate,showBeginSeaconDate,beginseaconDate,endseaconDate,showEndSeaconDate){
      console.log('durTypeFlag is',durTypeFlag);
      this.set('durTypeFlag',durTypeFlag);
      this.set('beginseaconFlag',beginseaconFlag);
      this.set('endseaconFlag',endseaconFlag);
      this.set('showStartDate',showStartDate);
      console.log('submmit:showStartDate',this.get('showStartDate'));
      this.set('showEndDate',showEndDate);
      console.log('submmit:showEndDate',this.get('showEndDate'));
      this.set('beginDate',beginDate);
      console.log('submmit:beginDate',this.get('beginDate'));
      this.set('endDate',endDate);
      this.set('showBeginSeaconDate',showBeginSeaconDate);
      this.set('beginseaconDate',beginseaconDate);
      this.set('endseaconDate',endseaconDate);
      this.set('showEndSeaconDate',showEndSeaconDate);
      if(beginseaconFlag=='beginone'){
        this.set('seaconShow','第一季度');
      }
      if(beginseaconFlag=='beginsecond'){
        this.set('seaconShow','第二季度');
      }
      if(beginseaconFlag=='beginthird'){
        this.set('seaconShow','第三季度');
      }
      if(beginseaconFlag=='beginfour'){
        this.set('seaconShow','第四季度');
      }
      if(endseaconFlag=='endone'){
        this.set('endseaconShow','第一季度');
      }
      if(endseaconFlag=='endsecond'){
        this.set('endseaconShow','第二季度');
      }
      if(endseaconFlag=='endthird'){
        this.set('endseaconShow','第三季度');
      }
      if(endseaconFlag=='endfour'){
        this.set('endseaconShow','第四季度');
      }
      var doQueryFlag=this.get('doQueryFlag');
      doQueryFlag=++doQueryFlag;
      this.set('doQueryFlag',doQueryFlag);
    }
  }
});
