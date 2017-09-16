import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var consult = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  createDateTime: DS.attr('number'),//创建时间
  advTel: DS.attr('string'),//咨询人电话
  advContent: DS.attr('string'),//咨询内容
  advDate: DS.attr('number'),//咨询日期
  advGender: DS.belongsTo('dicttype'),//咨询人性别,1男2女
  advGoal: DS.attr('string'),//咨询目的
  advName: DS.attr('string'),//咨询人姓名
  advWay: DS.hasMany('dicttype'),//获取机构信息途径
  appointmentDate: DS.attr('number'),//预约参观日期
  care: DS.attr('string'),//重点关心
  consultChannel: DS.belongsTo('dicttype'),//咨询方式
  receiveStaff: DS.belongsTo('employee'),//接待员工
  dietRequirements: DS.attr('string'),//饮食要求
  discontent: DS.attr('string'),//不满意的地方
  customerAddr: DS.attr('string'),//老人住址
  customerBrith: DS.attr('number'),//老人生日
  customerCardCode: DS.attr('number'),//老人身份证号
  customerConsumingAbility: DS.attr('string'),//老人消费水平
  customerTel: DS.attr('number'),//老人电话
  customerEducation: DS.belongsTo('dicttype'),//老人教育级别
  customerGender: DS.belongsTo('dicttype'),//老人性别,1男2女
  customerName: DS.attr('string'),//老人名字
  customerNative: DS.belongsTo('dicttype'),//老人籍贯
  customerPS: DS.attr('string'),//老人身体状况
  consultRelation: DS.belongsTo('dicttype'),//咨询人与老人关系
  customerSelfCareAbility: DS.belongsTo('dicttype'),//老人自理能力
  customerNationality: DS.belongsTo('dicttype'),//老人名族
  occupancyIntent: DS.attr('string'),//入住意向
  consultStatus: DS.belongsTo('dicttype'),//咨询状态
  otherRequirements: DS.attr('string'),//其他要求
  psychologicalPrice: DS.attr('string'),//心理价格
  review: DS.attr('string'),//参观感受
  roomRequirements: DS.attr('string'),//房屋要求
  serviceRequirements: DS.attr('string'),//服务要求
  heartStaff: DS.belongsTo('employee'),//孝心助理
  remark: DS.attr('string'),//备注
  backVistInfos:DS.hasMany('backvist'),//对应回访表
  inPreference: DS.hasMany('dicttype'),//入住偏好
  liveIntent:DS.belongsTo('dicttype'),//入住意向
  otherReceiveStaff: DS.belongsTo('employee'),//预约接待人
  backvistNum: DS.attr('number'),
  //咨询人性别
  advGenderName:Ember.computed('advGender',function(){
    let advGender = this.get('advGender');
    if(advGender.get('typename') == '男'){
      return '先生';
    }
    if(advGender.get('typename') == '女'){
      return '女士';
    }
  }),
  advWayName:Ember.computed('advWay',function(){
    var str ='';
    this.get('advWay').forEach(function(advWayObj){
      str+=advWayObj.get('typename')+',';
    });
    return str.substring(0,str.length - 1);
  }),
  inPreferenceName:Ember.computed('inPreference',function(){
    var str ='';
    this.get('inPreference').forEach(function(inPreferenceObj){
      str+=inPreferenceObj.get('typename')+',';
    });
    return str.substring(0,str.length - 1);
  }),
  //咨询日期
  advDateComputed:Ember.computed("advDate",function(){
    var advDate=this.get("advDate");
    if(!advDate){
      return null;
    }
    return this.get("dateService").timestampToTime(advDate);
  }),
  advDateStringList:Ember.computed("advDate",function(){
    var advDate=this.get("advDate");
    return this.get("dateService").formatDate(advDate,"yyyy-MM-dd");
    }),
  advDateStringDetail:Ember.computed("advDate",function(){
    var advDate=this.get("advDate");
    return this.get("dateService").formatDate(advDate,"yyyy-MM-dd hh:mm");
    }),
  //预约入住日期
  appointmentDateComputed:Ember.computed("appointmentDate",function(){
    var appointmentDate=this.get("appointmentDate");
    if(!appointmentDate){
      return null;
    }
    return this.get("dateService").timestampToTime(appointmentDate);
  }),
  appointmentDateString: Ember.computed("appointmentDate", function() {
      var createDateTime = this.get("appointmentDate");
      if(!createDateTime){return null;}
      var timeStr = this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd hh:mm");
      var timeString = timeStr.replace(/-0/,"年");
      timeString = timeString.replace(/-/,"月");
      timeString = timeString.replace(/ /,"日 ");
      console.log("timeString.charAt(0):",timeString.charAt(0));
      if(timeString.charAt(0) == "0"){
        var createDateTimeShortString = timeString.substring(1);
        return createDateTimeShortString;
      }else{
        return timeString;
      }
  }),
    remarkString:Ember.computed("remark",function(){
      var remark=this.get("remark");
      if(remark){
         if(remark.length>10){
           return   remark.substring(0, 9)+"...";
         }else{
           return remark;
         }
      }else {
        return null;
      }
      }),
      careString:Ember.computed("care",function(){
        var remark=this.get("care");
        if(remark){
           if(remark.length>10){
             return   remark.substring(0, 9)+"...";
           }else{
             return remark;
           }
        }else {
          return null;
        }
        }),
        dietRequirementsString:Ember.computed("dietRequirements",function(){
          var remark=this.get("dietRequirements");
          if(remark){
             if(remark.length>10){
               return   remark.substring(0, 9)+"...";
             }else{
               return remark;
             }
          }else {
            return null;
          }
          }),
        serviceRequirementsString:Ember.computed("serviceRequirements",function(){
          var remark=this.get("serviceRequirements");
          if(remark){
             if(remark.length>10){
               return   remark.substring(0, 9)+"...";
             }else{
               return remark;
             }
          }else {
            return null;
          }
          }),
        otherRequirementsString:Ember.computed("otherRequirements",function(){
          var remark=this.get("otherRequirements");
          if(remark){
             if(remark.length>10){
               return   remark.substring(0, 9)+"...";
             }else{
               return remark;
             }
          }else {
            return null;
          }
          }),
        discontentString:Ember.computed("discontent",function(){
          var remark=this.get("discontent");
          if(remark){
             if(remark.length>10){
               return   remark.substring(0, 9)+"...";
             }else{
               return remark;
             }
          }else {
            return null;
          }
          }),
        roomRequirementsString:Ember.computed("roomRequirements",function(){
          var remark=this.get("roomRequirements");
          if(remark){
             if(remark.length>10){
               return   remark.substring(0, 9)+"...";
             }else{
               return remark;
             }
          }else {
            return null;
          }
          }),
  // customerBrithDate:Ember.computed("customerBrith",function(){
  //   var customerBrith=this.get("customerBrith");
  //   if(!customerBrith){
  //     return null;
  //   }
  //   return this.get("dateService").timestampToTime(customerBrith);
  // }),
  // customerBrithString:Ember.computed("customerBrith",function(){
  //   if(this.get('customerBrith')){
  //     var customerBrith=this.get("customerBrith");
  //     return this.get("dateService").formatDate(customerBrith,"yyyy-MM-dd");
  //   }else {
  //     return null;
  //   }
  //   }),
  advDateShortString: Ember.computed("advDate", function() {
      var createDateTime = this.get("advDate");
      if(!createDateTime){return null;}
      var timeStr = this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd hh:mm");
      var timeString = timeStr.replace(/-0/,"年");
      timeString = timeString.replace(/-/,"月");
      timeString = timeString.replace(/ /,"日 ");
      console.log("timeString.charAt(0):",timeString.charAt(0));
      if(timeString.charAt(0) == "0"){
        var createDateTimeShortString = timeString.substring(1);
        return createDateTimeShortString;
      }else{
        return timeString;
      }
  }),
  //是否已预定
  computedStatus:Ember.computed("consultStatus",function(){
    var consultStatus=this.get("consultStatus");
    if(consultStatus.get("typecode")=="consultStatus3"){
      return true;
    }else{
      return false;
    }
    // var str="";
    // if(consultStatus.get("typecode")=="consultStatus3"){
    //   str+="已预定";
    // }else {
    //   str+='<a {{action "jumpAdvance" consult on="click"}}>'+"咨询转预定"+"</a>";
    // }
    // return str;
  }),
});
export default consult;
