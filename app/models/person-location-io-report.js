import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({//轨迹表
  dateService: Ember.inject.service('date-service'),
  room: DS.belongsTo('room'),//所在房间
  employee: DS.belongsTo('employee'),//员工
  remark:DS.attr('string'),
  generatorTime:DS.attr('number'),//统计时间
  inTime:DS.attr('number'),//进入时间
  outTime:DS.attr('number'),//离开时间
  inTimeDay:Ember.computed("inTime",function(){
    var time = this.get("inTime");
    // time=time-24*60*60;//库里的时间是同步时间,比实际时间多一天,需要减一天
    return time?this.get("dateService").formatDate(time,"yyyy-MM-dd"):"";
    }),
    inTimeHour:Ember.computed("inTime",function(){
      var time = this.get("inTime");
      // time=time-24*60*60;//库里的时间是同步时间,比实际时间多一天,需要减一天
      return time?this.get("dateService").formatDate(time,"hh:mm"):"";
      }),
});
