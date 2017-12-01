import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var Health = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
pathConfiger: Ember.inject.service("path-configer"),
itemtype: DS.belongsTo('dicttype'),//体检项目
examDateTime:DS.attr("number"), //体检时间
healthentry:DS.belongsTo('health-info-entry'),//数据录入批存
result:DS.attr("string"),//体检结果
resultAddtion:DS.attr("string"),//体检结果补充1
resultAddtionSec:DS.attr("string"),//体检结果补充2
resultAddtionThir:DS.attr("string"),
resultAddtionFou:DS.attr("string"),
resultAddtionFiv:DS.attr("string"),
resultAddtionSix:DS.attr("string"),
resultAddtionSev:DS.attr("string"),
resultAddtionEig:DS.attr("string"),
resultAddtionNin:DS.attr("string"),
resultAddtionTen:DS.attr("string"),
examUser:DS.belongsTo('customer'),//体检人
createUser:DS.belongsTo('user'),//创建人
createDateTime:DS.attr("number"), //创建时间
day:DS.attr("number"), //当前日期
hourSeq:DS.attr("number"), //当前时间
seq:DS.attr("number"), //表示记录的是第几条
heartImg:DS.attr('string'), //心电图地址
sourceFlag:DS.attr('string'),//日四类标识
//remark:DS.attr("string"),//备注(加单位)
realHeartImg:Ember.computed('heartImg',function(){
  var heartImg=this.get('heartImg');
  return 'data:image/png;base64,/'+heartImg;
}),
totalResult:Ember.computed('result','resultAddtion','resultAddtionSec','resultAddtionThir','resultAddtionFou','resultAddtionFiv','resultAddtionSix','resultAddtionSev','resultAddtionEig','resultAddtionNin','resultAddtionTen',function(){
  var a='';
  a+=this.get('result')+'/'+this.get('resultAddtion')+'/'+this.get('resultAddtionSec')+'/'+this.get('resultAddtionThir')+'/'+this.get('resultAddtionFou')+'/'+this.get('resultAddtionFiv');
  return a+=this.get('resultAddtionSix')+'/'+this.get('resultAddtionSev')+'/'+this.get('resultAddtionEig')+'/'+this.get('resultAddtionNin')+'/'+this.get('resultAddtionTen');
}),
bloodResult:Ember.computed('result','resultAddtion',function(){
  if(this.get('resultAddtion')&&(this.get('result'))){
    return this.get('result')+'/'+this.get('resultAddtion');
  }else {
    return this.get('result');
  }
}),
oxygenResult:Ember.computed('result','resultAddtion',function(){
  if(this.get('resultAddtion')&&(this.get('result'))){
    return this.get('result')+'/'+this.get('resultAddtion');
  }else {
    return this.get('result');
  }
}),
bloodFatResult:Ember.computed('result','resultAddtion','resultAddtionSec','resultAddtionThir','resultAddtionFou',function(){
  var str='';
  str+=this.get('result')+'/'+this.get('resultAddtion')+'/'+this.get('resultAddtionSec')+'/'+this.get('resultAddtionThir')+'/'+this.get('resultAddtionFou');
  return str;
}),
examDate:Ember.computed("examDateTime",function(){
  var examDateTime=this.get("examDateTime");
  return this.get("dateService").timestampToTime(examDateTime);
}),
examDateString:Ember.computed("examDateTime",function(){
  var examDateTime=this.get("examDateTime");
  return this.get("dateService").formatDate(examDateTime,"yyyy-MM-dd hh:mm");
}),
examDateHourS:Ember.computed("examDateTime",function(){
  var examDateTime=this.get("examDateTime");
  return this.get("dateService").formatDate(examDateTime,"hh:mm");
}),
examDateYMD:Ember.computed("examDateTime",function(){
  var examDateTime=this.get("examDateTime");
  return this.get("dateService").formatDate(examDateTime,"yyyy.MM.dd");
}),
examDateDayHourS:Ember.computed("examDateTime",function(){
  var examDateTime=this.get("examDateTime");
  return this.get("dateService").formatDate(examDateTime,"MM-dd hh:mm");
}),
week:Ember.computed("examDateTime",function(){
  var examDateTime = this.get("examDateTime");
  var weekTab = this.get("dateService").timestampToTime(examDateTime).getDay();
  var weekArray = ["周日","周一","周二","周三","周四","周五","周六"];
  return weekArray[weekTab];
  // for(var i = 0 ; i< weekArray.length ; i++){
  //   if(weekTab==i){
  //     return weekArray[i];
  //   }
  // }
}),
examDateStringMobile:Ember.computed("examDateTime",function(){
  var examDateTime=this.get("examDateTime");
  return this.get("dateService").formatDate(examDateTime,"MM-dd");
}),
realResult:Ember.computed("itemtype","result",function(){
  var itemtype=this.get("itemtype");
  var remark=this.get("itemtype.remark");
  var result=this.get("result");
  var str="";
  if(!result){
    result="";
  }
  if(!remark){
    remark="";
  }
    console.log("tijianxiangmushi",itemtype.get("typename"));
    console.log("danweishishenm",itemtype.get("remark"));
    str+=result;
    str+=remark;
    return str;
}),
realResultAddtion:Ember.computed("resultAddtion",function(){
  var resultAddtion=this.get("resultAddtion");
  if(!resultAddtion){
    resultAddtion="";
  }
  var str="";
  str+=resultAddtion+"mmHg";
  return str;
}),
resultType:Ember.computed("itemtype",'result','resultAddtion','resultAddtionSec',
'resultAddtionThir','resultAddtionFou','resultAddtionFiv','resultAddtionSix',
'resultAddtionSev','resultAddtionEig','resultAddtionNin','resultAddtionTen',function(){
  var itemtype = this.get("itemtype");
  var result = this.get("result");
  var resultAddtion = this.get("resultAddtion");
  var itemtypecode = itemtype.get("typecode");
  var itemtypeRemark = itemtype.get("remark");
  var remarkObj = {};
  var resultUnit = "";//结果和单位
  if(itemtypecode=="healthExamType1"){//血压
    resultUnit = result+"/"+resultAddtion+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType2") {//血氧 删除了脉搏
    console.log("itemtypeRemark",itemtypeRemark);
    remarkObj = JSON.parse(itemtypeRemark);
    console.log("remarkObj.unitOne",remarkObj.unitOne);
    resultUnit = result+" "+remarkObj.unitOne;
  }else if (itemtypecode=="healthExamType3") {//心率
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType4") {//呼吸频率
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType5") {//体温
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType6") {//体重
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType7") {//血糖-空腹血糖
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType8") {//血糖-餐前血糖
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType9") {//血糖-餐后血糖
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType10") {//脂肪数据
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType11") {//心电分析图
    resultUnit = result+" "+itemtypeRemark;
  }else if (itemtypecode=="healthExamType12") {//尿液
    resultUnit = "白细胞:"+result+"，亚硝酸盐:"+resultAddtion+"，尿胆原:"+this.get("resultAddtionSec")+
    "，蛋白质:"+this.get("resultAddtionThir")+"，酸碱度:"+this.get("resultAddtionFou")+"，红细胞:"+this.get("resultAddtionFiv")+
    "，比重:"+this.get("resultAddtionSix")+"，酮体:"+this.get("resultAddtionSev")+"，胆黄素:"+this.get("resultAddtionEig")+
    "，尿葡萄糖:"+this.get("resultAddtionNin")+"，维生素:"+this.get("resultAddtionTen");
  }else if (itemtypecode=="healthExamType13") {//血脂
    resultUnit = "胆固醇:"+result+"("+itemtypeRemark+")，高密度蛋白胆固醇含量:"+resultAddtion+"("+itemtypeRemark+")，甘油三酯含量:"+this.get("resultAddtionSec")+
    "("+itemtypeRemark+")，低密度蛋白胆固醇含量:"+this.get("resultAddtionThir")+"("+itemtypeRemark+")，总胆固醇和高密度胆固醇比值:"+this.get("resultAddtionFou");
  }
  return resultUnit;
}),
resHbsType:Ember.computed("itemtype",function(){
  var itemtypecode = this.get("itemtype.typecode");
  var str = "";
  if (itemtypecode=="healthExamType2"||itemtypecode=="healthExamType12"||itemtypecode=="healthExamType13") {
    str = 1;
  }
  return str;
}),
hbsTypeUnit:Ember.computed("itemtype",function(){
  var itemtypecode = this.get("itemtype.typecode");
  var itemtypeRemark = this.get("itemtype.remark");
  var str = "";
  if (itemtypecode=="healthExamType2"||itemtypecode=="healthExamType12") {
    str = JSON.parse(itemtypeRemark).unitOne;
  }else {
    str = itemtypeRemark;
  }
  return str;
}),

});

export default Health;
