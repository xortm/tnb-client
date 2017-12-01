import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  //store: Ember.inject.service("store"),
  plan:DS.belongsTo('nursingplan'),//护理计划
  warning:DS.belongsTo('hbeaconwarning'),//挂接的呼叫信息//康怡眼删除
  exeStaff:DS.belongsTo('employee'),//服务人员
  itemProject:DS.belongsTo('nursingprojectitem'),//护理项目/按次统计的
  // itemPlan:DS.belongsTo('nursingplanitem'),//护理项目/按时统计的(变了不用这个了)
  exeStartTime:DS.attr('number'),//开始时间
  exeEndTime:DS.attr('number'),//结束时间
  createDateTime:DS.attr('number'),//创建时间,执行时间
  // createUser:DS.belongsTo('user'),//创建人
  remark:DS.attr('string'),//备注
  detail:DS.belongsTo('nursingplandetail'),//护理项目/按时统计的
  exeStatus :DS.belongsTo('dicttype'),//执行状态   groupCode:planExeStatus
  finishLevel:DS.belongsTo('servicefinishlevel'),//完成情况
  exeTabRemark:DS.attr('string'),//执行情况
  // 居家新添加的屬性
  planExeDate:DS.attr('string'),//计划开始时间
  recorder:DS.belongsTo('customer'),
  // realMoneyCost:DS.attr('number'),//实际花费(钱)
  // realPointCost:DS.attr('number'),//实际花费(积分)
  pointIncrease:DS.attr('number'),//获得积分
  recordUser:DS.belongsTo('user'),//记录人
  realCost:Ember.computed('realMoneyCost','realPointCost',function(){
    if(this.get("realMoneyCost")){
      return this.get("realMoneyCost")+"元";
    }else{
      return this.get("realPointCost")+"分";
    }
  }),
  //判断执行情况
  // execute:Ember.computed('remark',function(){
  //   var remark=this.get('remark');
  //   if(remark){
  //     var remarkData = JSON.parse(remark);
  //     var remarkTag = remarkData.serviceTag;
  //     if(remarkTag){
  //         var executeName = this.get("store").peekRecord("dicttype", remarkTag).get("typename");
  //         return executeName;
  //     }else {
  //       return '正常完成';
  //     }
  //   }else {
  //     return '正常完成';
  //   }
  // }),
  remarkString:Ember.computed('remark','itemProject','detail',function(){//这个是定时和计次服务 集合的remark
    let remark = this.get("remark");
    var _self = this;
    var str = "";
    if (remark) {
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        var itemData = JSON.parse(remark);
        var itemDataServiceDesc = itemData.serviceDesc;
        var itemDataTag = itemData.serviceTag;
        var serviceTagexe = itemData.serviceTagexe;
        var applyUserId = itemData.applyUserId;
        console.log("itemData",itemData);
        console.log("itemData.length",itemData.length);
        if(itemData.length>0){//不定时任务
          var theStr = '';
          itemData.forEach(function(item,index){
            var theTime = _self.get("dateService").formatDate(item.finishTime,"hh:mm");
            theStr += theTime + "完成第"+(index+1)+"次；";
          });
          console.log("itemData theStr",theStr);
          str = theStr.substring(0,theStr.length-1);
        }else {
          if(itemDataTag){
            var dictServiceTypename = _self.get("dataLoader").findDict(itemDataTag).get("typename");
            if(itemDataServiceDesc){
              str = dictServiceTypename+"，"+itemDataServiceDesc;
            }else {
              str = dictServiceTypename;
            }
          }else if (serviceTagexe) {
            if(itemDataServiceDesc){
              str = serviceTagexe+"，"+itemDataServiceDesc;
            }else {
              str = serviceTagexe;
            }
          }else {
            str = "正常完成";
            if(itemDataServiceDesc){
              str = str + "，"+ itemDataServiceDesc;
            }
          }
          console.log("itemData str",str);
        }

      }else {
        str = "老人配合，正常完成" + remark;
      }
    }else {
      str = "老人配合，正常完成";
    }
    return str;
  }),

  remarkStr:Ember.computed('remark','type',function(){
    if(this.get('remark')&&this.get('type')){
      let remark = this.get('remark');
      let type = this.get('type');
      let str;
      if(remark.charAt(0)=='{'){
        str = JSON.parse(remark).serviceDesc;
        return str;
      }
      else if(remark.charAt(0)=='['){
        str = JSON.parse(remark);
        let rem = '';
        str.forEach(function(item,index){
          rem += '第'+(index+1)+'次:'+item.content+';';
        });
        return rem;
      }else{
        return remark;
      }
    }
  }),

  serviceName:Ember.computed('itemProject','detail',function(){
    if(this.get('detail.item.item.name')){
      return this.get('detail.item.item.name');
    }
    if(this.get('itemProject.item.name')){
      return this.get('itemProject.item.name');
    }
  }),

  // serviceName:Ember.computed('itemProject','itemPlan',function(){
  //   if(this.get('itemPlan.item.item.name')){
  //     return this.get('itemPlan.item.item.name');
  //   }
  //   if(this.get('itemProject.item.name')){
  //     return this.get('itemProject.item.name');
  //   }
  // }),
  planStartTime:Ember.computed("exeStartTime",function(){
    var planStartDate=this.get("exeStartTime");
    if(!planStartDate){
      return null;
    }
    return this.get("dateService").timestampToTime(planStartDate);
  }),
  planStartTimeString:Ember.computed("exeStartTime",function(){
    var planStartDate=this.get("exeStartTime");
    return this.get("dateService").formatDate(planStartDate,"yyyy-MM-dd hh:mm");
  }),
  createDateTimeString:Ember.computed("createDateTime",function(){
    var planStartDate=this.get("createDateTime");
    return this.get("dateService").formatDate(planStartDate,"hh:mm");
  }),
  startTimeHourS:Ember.computed("exeStartTime",function(){
    var planStartDate=this.get("exeStartTime");
    return this.get("dateService").formatDate(planStartDate,"hh:mm");
  }),
  startTimeYMD:Ember.computed("exeStartTime",function(){
    var planStartDate=this.get("exeStartTime");
    return this.get("dateService").formatDate(planStartDate,"yyyy.MM.dd");
  }),
  week:Ember.computed("exeStartTime",function(){
    var planStartDate = this.get("exeStartTime");
    var weekTab = this.get("dateService").timestampToTime(planStartDate).getDay();
    var weekArray = ["周日","周一","周二","周三","周四","周五","周六"];
    return weekArray[weekTab];
  }),
  //标识属于那种类型的服务，1计时2计次
  type:Ember.computed("itemPlan",function(){
    if(this.get("itemPlan")){
      return 1;
    }
    return 2;
  }),
  busiId:Ember.computed("itemPlan",function(){
    if(this.get("itemPlan")){
      return this.get("itemPlan.id");
    }
    return this.get("itemProject.id");
  }),
  couldDel:Ember.computed('exeStartTime',function(){
    let exeStartTime = this.get('exeStartTime');
    let nowTime = new Date();
    //今天第一秒
    let firstSecond = this.get('dateService').getFirstSecondStampOfDay(nowTime);
    //今天最后一秒
    let lastSecond = this.get('dateService').getLastSecondStampOfDay(nowTime);
    console.log('第一秒：',firstSecond,'最后一秒:',lastSecond,'执行时间：',exeStartTime);
    if(exeStartTime<lastSecond&&exeStartTime>firstSecond){
      return true;
    }else{
      return false;
    }
  }),
});
