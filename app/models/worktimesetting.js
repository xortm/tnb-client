import DS from 'ember-data';
import BaseModel from './base-model';

var worktimesetting = BaseModel.extend({
  name:DS.attr('string'),//名称
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  startTime:DS.attr('string'),//开始时间
  startTimeInt:DS.attr('string'),//开始时间戳
  endTime:DS.attr('string'),//结束时间
  endTimeInt:DS.attr('number'),//结束时间戳
  remark:DS.attr('string'),//备注
  beds:DS.hasMany('bedworktimesetting'),//照护床位
  // floor:DS.hasmany('floor')
  dateService: Ember.inject.service("date-service"),
  colorFlag:DS.belongsTo('dicttype'),//班次颜色
  colorName:Ember.computed('colorFlag',function(){
    let colorFlag = this.get('colorFlag');
    if(!colorFlag){
      return null;
    }
    let name;
    switch (colorFlag.get('typecode')) {
      case 'colorType1':
        name =  "work-color-1";
        break;
      case 'colorType2':
        name =  "work-color-2";
        break;
      case 'colorType3':
        name =  "work-color-3";
        break;
      case 'colorType4':
        name =  "work-color-4";
        break;
      case 'colorType5':
        name =  "work-color-5";
        break;
      case 'colorType6':
        name =  "work-color-6";
        break;
      case 'colorType7':
        name =  "work-color-7";
        break;
      case 'colorType8':
        name =  "work-color-8";
        break;
      case 'colorType9':
        name =  "work-color-9";
        break;
      default:
        name = "work-color-9";
        break;
    }
    return name;
  }),
  subName:Ember.computed('name',function(){
    let name = this.get('name');
    var sub = {};
    sub.getLength = function(str) {
      return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };
    let num = sub.getLength(name);//获得名称长度
    if(num<13){
      return name;
    }
    if(num>12){
      name = name.substring(0,5) + '...';
      return name;
    }
  }),
  startTimedateShow:Ember.computed("startTime",function(){//给 插件 date属性的值 只为显示
    var startTime = this.get("startTime");
    if(startTime){
      var str = startTime.split(":") ;
      var theHouer = str[0];
      var theM = str[1];
      var newTime = new Date();
      newTime.setHours(theHouer,theM);
      return newTime;
    }else {
      return null;
    }
  }),
  endTimedateShow:Ember.computed("endTime",function(){//给 插件 date属性的值 只为显示
     var endTime = this.get("endTime");
     if(endTime){
       var str = endTime.split(":") ;
       var theHouer = str[0];
       var theM = str[1];
       var newTime = new Date();
       newTime.setHours(theHouer,theM);
       return newTime;
     }else {
       return null;
     }
  }),

  // startTimeDate:Ember.computed("startTime",function(){
  //   var startTime=this.get("startTime");
  //   if(!startTime){
  //     return null;
  //   }
  //   return this.get("dateService").timestampToTime(startTime);
  // }),
  // startTimeString:Ember.computed("startTime",function(){
  //   var startTime=this.get("startTime");
  //   return this.get("dateService").formatDate(startTime,"yyyy-MM-dd hh:mm:ss");
  //   }),
  //
  // endTimeDate:Ember.computed("endTime",function(){
  //     var endTime=this.get("endTime");
  //     if(!endTime){
  //       return null;
  //     }
  //     return this.get("dateService").timestampToTime(endTime);
  //   }),
  // endTimeString:Ember.computed("endTime",function(){
  //     var endTime=this.get("endTime");
  //     return this.get("dateService").formatDate(endTime,"yyyy-MM-dd hh:mm:ss");
  //   }),
});

export default worktimesetting;
