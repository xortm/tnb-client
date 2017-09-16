import Model from 'ember-data/model';
import BaseModel from './base-model';
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';
/*工单追加*/
export default BaseModel.extend({
  dateService:Ember.inject.service('date-service'),

  code:DS.attr('string'),//编码
  workorder:DS.belongsTo('workorder'),//对应工单
  content:DS.attr('string'),//备注内容
  additional:DS.belongsTo('user'),//追加人
  createTime:DS.attr('number'),//创建时间
  remindTime:DS.attr('number'),//提醒日期
  additionalType:DS.attr('number'),//追加类型 0联系提醒 1备注
  createTimeShow: Ember.computed('createTime',function() {
    var dateOri = this.get("createTime");
    if(dateOri === undefined){
      var date = "";
    }
    else{
    var date = new Date(dateOri*1000);
    var time = this.judge(date);
    date=this.get('dateService').formatDate(dateOri,'yyyy-MM-dd')+" "+time;
    }
    return date;
  }),
  remindTimeShow: Ember.computed('remindTime',function() {
    var dateOri = this.get("remindTime");
    console.log('dateOri',dateOri);
    if(dateOri === undefined){
      var date = "";
    }
    else{
    var date = new Date(dateOri*1000);
    var time = this.judge(date);
    date=this.get('dateService').formatDate(dateOri,'yyyy-MM-dd')+" "+time;
    }
    return date;
  }),
  additionalTypeShow:Ember.computed('additionalType',function(){
    if(this.get('additionalType') === 1) {
      return "信息";
    }
    else{
      return "联系提醒";
    }
  }),
  judge:function(date){
    var hours='';
    var minutes='';
    var seconds='';
    if(date.getHours()>=0 && date.getHours()<=9){
      hours = '0'+date.getHours();
      console.log('timehour',hours);
    }
    else{hours = date.getHours();}
    if(date.getMinutes()>=0 && date.getMinutes()<=9){
      minutes = '0'+date.getMinutes();
      console.log('timeminute',minutes);
    }
    else{minutes = date.getMinutes();}
    if(date.getSeconds()>=0 && date.getSeconds()<=9){
      seconds = '0'+date.getSeconds();
      console.log('timesecond',seconds);
    }
    else{seconds = date.getSeconds();}
    return hours + ":" + minutes + ":" + seconds;
  },
});
