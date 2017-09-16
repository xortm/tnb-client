import DS from 'ember-data';
import BaseModel from './base-model';

var Nursingplan = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  planType:DS.belongsTo('dicttype'),//计划类型
  customer:DS.belongsTo('customer'),//客户
  planStartTime:DS.attr('number'),//计划开始时间
  planEndTime:DS.attr('number'),//计划结束时间
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//备注
  services:DS.hasMany('nursingplanitem',{inverse:'plan'}),//护理项目
  planStartDateTime :Ember.computed("planStartTime",function(){
    var planStartDate=this.get("planStartTime");
    return this.get("dateService").timestampToTime(planStartDate);
  }),
  planStartDateString:Ember.computed("planStartTime",function(){
    var planStartDate=this.get("planStartTime");
    return this.get("dateService").formatDate(planStartDate,"yyyy-MM-dd");

  }),
  planEndDateTime :Ember.computed("planEndTime",function(){
    var planEndDate=this.get("planEndTime");
    return this.get("dateService").timestampToTime(planEndDate);
  }),
  planEndDateString:Ember.computed("planEndTime",function(){
    var planEndDate=this.get("planEndTime");
    return this.get("dateService").formatDate(planEndDate,"yyyy-MM-dd");

  }),
  endTime:Ember.computed('planEndTime',function(){
    var dateOri = this.get("planEndTime");
    var date = new Date(dateOri*1000);
    if(date === 'Invalid Date'){
      date = '';
    }
    else{
      date = date.getFullYear()+"-"+this.toDbl(date.getMonth()+1)+"-"+this.toDbl(date.getDate())+" "+this.toDbl(date.getHours())+":"+this.toDbl(date.getMinutes());
    }
    return date;
  }),
  toDbl: function(value) {
    if(value<10)
    {
      return '0'+value;
    }
    else
    {
      return ''+value;
    }
  },
});

export default Nursingplan;
