import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*消息列表*/
export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  dataLoader: Ember.inject.service("data-loader"),
  code: DS.attr('string'),//协议号
  business: DS.attr('string'),//业务类型
  businessType: DS.belongsTo('dicttype'),//消息类型 类型Dicttype,groupcoud为messageBusinessType
  type: DS.attr('number'),// 类型： 1 站内信  2 提醒 3电话事件  4居家手机端消息
  detailType: DS.attr('number'),//详细类型（提醒类型/站内信类型） 1任务提醒2签到提醒3支付信息
  content: DS.attr('string'),// 内容
  createTime:DS.attr('number'),//创建时间
  updateTime:DS.attr('number'),//更新时间
  fromUser: DS.belongsTo('user'), //发送人
  toUser: DS.belongsTo('user'), //接收人
  remark:DS.attr('string'),//备注
  hasRead:DS.attr('number'),//是否已读 1是  0否
  num:DS.attr('number'),//未读消息数
  display_extend:true,

  createTimeDate: Ember.computed("createTime", function() {
      var createTime = this.get("createTime");
      return this.get("dateService").timestampToTime(createTime);
  }),

  typeNum:Ember.computed("type",function(){
    var type = this.get("type");
    if(type===1){
      return 1;
    }
    if(type===2){
      return 2;
    }
  }),
  detailTypeStr:Ember.computed("detailType",function(){
    var showStr = "";
    if(this.get("code")===1102){
      showStr = "预警提醒";
    }
    if(this.get("detailType")===2){
      showStr = "缴费提醒";
    }
    if(this.get("detailType")===3){
      showStr = "签到提醒";
    }
    if(this.get("detailType")===4){
      showStr = "服务提醒";
    }
    if(this.get("code")===1101){
      showStr = "健康数据提醒";
    }
    if(this.get("code")===1103){
      showStr = "位置信息";
    }
    return showStr;
  }),
  contentShow:Ember.computed("content","code","detailType","business","createTimeString",function(){
    var createTimeString = this.get("createTimeString");
    var business = this.get("business");
    var content = this.get("content");
    var code = this.get("code");
    console.log("messageNews111Content",content);
    let contentObj;
    if(content.charAt(0)=='{'||content.charAt(0)=='['){
      contentObj = JSON.parse(content);
    }else {
      return "";
    }
    var showStr = "";
    if(this.get("detailType")==1){
      if(business=="warning"){
        showStr = "“"+contentObj.customerName + "”老人发出预警，在"+contentObj.room + contentObj.bed + "请速去查看处理";
      }
      else if (business=="warningProcessed") {
        showStr = "“"+contentObj.customerName +"”老人在" + contentObj.time +"的预警已处理。";
      }
    }
    if(this.get("detailType")==2){
      if(business=="payment"){
        showStr = "“"+contentObj.customerName + "”老人在" + createTimeString +"成功缴费";
      }
    }
    if(this.get("detailType")==3){
      if(business=="sign"){
        showStr = "您已签到成功";
      }
    }
    if(this.get("detailType")==4){
      if(business=="service"){
        showStr = "给“" + contentObj.customerName + "”老人进行了" + contentObj.serviceName +"服务";
      }
    }
    if(code==1101){//健康数据提醒
      if(business=="healthExamType10"){
        showStr = "“"+contentObj.customerName +"”老人脂肪"  + contentObj.result;
      }
      else if (business=="healthExamType1") {
        showStr = "“"+contentObj.customerName +"”老人血压"  + contentObj.result + contentObj.resultAddtion;
      }
      else if (business=="healthExamType2") {
        showStr ="“"+contentObj.customerName +"”老人血氧"  + contentObj.result + contentObj.resultAddtion;
      }
      else if (business=="healthExamType8") {
        showStr = "“"+contentObj.customerName +"”老人血糖"  + contentObj.result;
      }
      else if (business=="healthExamType6") {
        showStr = "“"+contentObj.customerName +"”老人体重"  + contentObj.result;
      }
      else if (business=="healthExamType11") {
        showStr = "“"+contentObj.customerName +"”老人心电图"  + contentObj.result;
      }
      else if (business=="healthExamType12") {
        showStr = "“"+contentObj.customerName +"”老人尿液"  + contentObj.result + contentObj.resultAddtion + contentObj.resultAddtionSec +
          contentObj.resultAddtionThir + contentObj.resultAddtionFou + contentObj.resultAddtionFiv +  contentObj.resultAddtionSix +
          contentObj.resultAddtionSev + contentObj.resultAddtionEig + contentObj.resultAddtionNin + contentObj.resultAddtionTen;
      }
    }
    if(this.get("code")===1102){
      if(business=="buttonCalling"){
        showStr = "“"+contentObj.customerName +"”老人在，床位号为“"  + contentObj.bedId+"发出呼叫请立即前往！”";
      }
    }
    return showStr;
  }),
  createTimeStr1:Ember.computed("createTime",function(){
    var createTime = this.get("createTime");
    return this.get("dateService").formatDate(createTime,"yyyy-MM-dd");
  }),
  createTimeStr:Ember.computed("createTime",function(){
    var createTime = this.get("createTime");
    return this.get("dateService").formatDate(createTime,"yyyy-MM-dd hh:mm");
  }),
  createTimeString:Ember.computed("createTime",function(){
    var createTime = this.get("createTime");
    let sysTime = this.get("dataLoader").getNowTime();
    var todayString = this.get("dateService").formatDate(sysTime,"yyyy-MM-dd");
    var todayLastS = Number(this.get("dateService").getLastSecondStampOfDayString(todayString));//获取今天最后一秒的时间戳
    var todayfirstS = Number(this.get("dateService").getFirstSecondStampOfDayString(todayString));//获取今天第一秒的时间戳
    var yesterdayString = this.get("dateService").formatDate((sysTime-24*60*60),"yyyy-MM-dd");
    var yesterdayfirstS =Number( this.get("dateService").getFirstSecondStampOfDayString(yesterdayString));
    if(createTime > todayfirstS ){//今天
      return this.get("dateService").formatDate(createTime,"hh:mm");
    }else if(createTime > yesterdayfirstS && createTime < todayfirstS){//昨天
      return this.get("dateService").formatDate(createTime,"yyyy-MM-dd");
    }else {
      return this.get("dateService").formatDate(createTime,"yyyy-MM-dd");
    }

  }),

});
