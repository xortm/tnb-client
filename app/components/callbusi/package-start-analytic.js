import Ember from 'ember';
import BaseItem from '../ui/base-ui-item';
export default Ember.Component.extend({
  statusService: Ember.inject.service("current-status"),
  store: Ember.inject.service("store"),
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  dataLoader: Ember.inject.service("data-loader"),
  reRenderFlag:0,
  initQueryFlag:0,
  didInsertElement:function(){
    var _self = this;
  },
  //最大化
  maxium: function(){
    let dom = this.$();
    let id = dom.attr("id");
    // let idClone = id + "_clone";
    // var domClone = dom.clone(true);
    // domClone.attr("id",idClone);
    dom.addClass("maxium");
    dom.appendTo("body");
    $("#sidebar").hide();
    $("#main-content").hide();
    $("#header").hide();
    let num = $("div[name='containerId']").length;
    console.log("ana num:" + num);
    let h = $(window).height()/2;
    if(num===5){
      h = $(window).height()/2;
    }
    if(num===7){
      h = $(window).height()/3;
    }
    console.log("need set new height:" + h);
    $("div[name='containerId']").height(h);
  },
  //恢复正常显示
  normalium: function(){
    let dom = this.$();
    // let id = dom.attr("id");
    // let idClone = id + "_clone";
    // var domClone = $("#" + idClone);
    // domClone.remove();
    dom.removeClass("maxium");
    dom.appendTo("#marketing-charts");
    $("#sidebar").show();
    $("#main-content").show();
    $("#header").show();
    this.incrementProperty("reRenderFlag");
    // this.sendAction("sizeChangeAct");
  },
  sizeChangeObs: function(){
    //监控放大缩小标志
    if(!this.get("sizeFlag")){
      return;
    }
    if(this.get("sizeFlag")==="maxium"){
      this.maxium();
    }else{
      this.normalium();
    }
  }.observes("sizeFlag").on("init"),

  doQuery: function() {
    var _self = this;
    var durTypeFlag = this.get('durTypeFlag'); //统计区间,1:年 2季 3月 4周 5日
    if(!this.get("initQueryFlag") || !this.get('durTypeFlag')){return;}
    var fildurTypeFlag=null;
    if(durTypeFlag=='year'){
      fildurTypeFlag=1;
    }
    if(durTypeFlag=='season'){
      fildurTypeFlag=2;
    }
    if(durTypeFlag=='mouth'){
      fildurTypeFlag=3;
    }
    if(durTypeFlag=='day'){
      fildurTypeFlag=5;
    }
    var beginDate = this.get('beginDate'); //开始日期
    console.log('start-analytic:beginDate',beginDate);
    var endDate = this.get('endDate'); //结束日期
    //computed：季度-时间
    var beginseaconDate=this.get('beginseaconDate');
    var endseaconDate=this.get('endseaconDate');
    var beginseaconFlag=this.get('beginseaconFlag');
    var endseaconFlag=this.get('endseaconFlag');
    var begincurDate=null;//开始季度的第一个月第一天第一秒时间戳
    var beginYear=null;
    if(beginseaconDate){
      beginYear=parseInt(beginseaconDate.getFullYear());//年份
    }
    var beginMouth=null;//月份
    if(beginseaconFlag=='beginone'){//第一季度
      beginMouth=1;//月份
      begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
    }
    if(beginseaconFlag=='beginsecond'){//第二季度
      beginMouth=4;//月份
      begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
    }
    if(beginseaconFlag=='beginthird'){//第三季度
      beginMouth=7;//月份
      begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
    }
    if(beginseaconFlag=='beginfour'){//第四季度
      beginMouth=10;//月份
      begincurDate=this.get("dateService").getFirstSecondStampOfMonth(beginYear,beginMouth);
    }
    //-------------  结束-季度
    var endcurDate=null;//结束季度的第一个月第一天第一秒时间戳
    var endYear=null;
    if(endseaconDate){
      endYear=parseInt(endseaconDate.getFullYear());//年份
    }
    var endMouth=null;//月份
    if(endseaconFlag=='endone'){//第一季度
      endMouth=3;//月份
      endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
    }
    if(endseaconFlag=='endsecond'){//第二季度
      endMouth=6;//月份
      endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
    }
    if(endseaconFlag=='endthird'){//第三季度
      endMouth=9;//月份
      endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
    }
    if(endseaconFlag=='endfour'){//第四季度
      endMouth=12;//月份
      endcurDate=this.get("dateService").getLastSecondStampOfMonth(endYear,endMouth);
    }
    //查询条件-统计类型
    // var paramList=this.get('paramList');
    // var str='';
    // paramList.forEach(function(param){
    //   str+=param+'@$or';
    // });
    let statTypeCode=this.get('statTypeCode');
    //查询条件-开始时间(结束时间)
    var beginTime=null;
    var endTime=null;
    if(beginDate&&endDate){
      beginTime=beginDate;
      endTime=endDate;
    }
    if(beginseaconDate&&endseaconDate){
      beginTime=begincurDate;
      endTime=endcurDate;
    }
    console.log('strParams statTypeCode',statTypeCode);
    //var chartType = this.get('chartType'); //图表类型(比传)
    this.get('store').query('statquery', {
      filter: {
        '[statType][typecode]': statTypeCode,
        'durType':fildurTypeFlag,
        'beginTime':beginTime,
        'endTime':endTime,
      }
    }).then(function(dataList) {
      dataList=dataList.sortBy("statDate");
      //根据口径类型区分数据
      let dateStr = statTypeCode + "DataList";
      console.log("dateStr in dataList:",dateStr);
      _self.set(dateStr,dataList);

      if(dataList){
        var nextFlag=0;
        nextFlag=++nextFlag;
        _self.set('nextFlag',nextFlag);
        console.log('nextFlag对不对',nextFlag);
      }
    });
  }.observes('initQueryFlag','durTypeFlag'),

  actions:{
    queryAction:function(statTypeCode){
      this.set("statTypeCode",statTypeCode);
      this.incrementProperty("initQueryFlag");

    },
  },
});
