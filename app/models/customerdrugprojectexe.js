import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var CustomerDrug = BaseModel.extend({
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service("date-service"),
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  remark:DS.attr('string'),//备注
  remarkAdd:DS.attr('string'),//剩余药量(天)
  exeDate:DS.attr('number'),//执行时间  具体时间值 实际用药时间
  result:DS.belongsTo('dicttype'),//完成情况
  finishLevel:DS.belongsTo('servicefinishlevel'),//完成情况
  customerDrug:DS.belongsTo('customerdrug'),//所用药品
  drugNum:DS.attr('number'),//用药数量
  drugNumPlan:DS.attr('number'),//计划用药数量
  drugSpec:DS.belongsTo('dicttype'),//用药规格
  useDrugDate:DS.attr('string'),//计划用药时间
  drugProject:DS.belongsTo('customerdrugproject'),//用药计划
  couldDel:Ember.computed('exeDate',function(){//判断是否可以撤销
    let exeDate = this.get('exeDate');
    let nowTime = new Date();
    //今天第一秒
    let firstSecond = this.get('dateService').getFirstSecondStampOfDay(nowTime);
    //今天最后一秒
    let lastSecond = this.get('dateService').getLastSecondStampOfDay(nowTime);
    console.log('第一秒：',firstSecond,'最后一秒:',lastSecond,'执行时间：',exeDate);
    if(exeDate<lastSecond&&exeDate>firstSecond){
      return true;
    }else{
      return false;
    }

  }),
  resultName:Ember.computed('finishLevel','result',function(){
    let finishLevel = this.get('finishLevel');
    let result = this.get('result');
    if(finishLevel&&finishLevel.get('name')){
      return finishLevel.get('name');
    }else{
      return result.get('typename');
    }
  }),
  createTimeHourS:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"hh:mm");
  }),
  createTimeYMD:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"yyyy.MM.dd");
  }),
  week:Ember.computed("createDateTime",function(){
    var createDateTime = this.get("createDateTime");
    var weekTab = this.get("dateService").timestampToTime(createDateTime).getDay();
    var weekArray = ["周日","周一","周二","周三","周四","周五","周六"];
    // alert(weekTab+" "+weekArray[weekTab]+" "+new Date(createTimeYMD)+" ");//APP测试
    return weekArray[weekTab];
    // for(var i = 0 ; i< weekArray.length ; i++){
    //   if(weekTab==i){
    //     return weekArray[i];
    //   }
    // }
  }),
  exeDateTime:Ember.computed('exeDate',function(){
    let exeDate = this.get("exeDate");
    return this.get("dateService").formatDate(exeDate,"HH");
  }),
  exeDateString:Ember.computed("exeDate",function(){
    var exeDate=this.get("exeDate");
    return this.get("dateService").formatDate(exeDate,"yyyy-MM-dd hh:mm");
  }),
  remarkString:Ember.computed('remark',function(){
    let remark = this.get("remark");
    var _self = this;
    var str = "";
    if (remark) {
      if(remark.charAt(0)=='{'||remark.charAt(0)=='['){
        var itemData = JSON.parse(remark);
        var itemDataServiceDesc = itemData.serviceDesc;
        var itemDataTag = itemData.serviceTag;
        var serviceTagexe = itemData.serviceTagexe;
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
      }else {
        str =  remark;
      }
    }else {
      str = "";
      // str = "老人配合，正常完成";
    }
    return str;
  }),
});
export default CustomerDrug;
