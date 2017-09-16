import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({//轨迹表
  dateService: Ember.inject.service('date-service'),
  customer: DS.belongsTo('customer'),//老人
  room: DS.belongsTo('room'),//所在房间
  employee: DS.belongsTo('employee'),//员工
  remark:DS.attr('string'),
  locationTime:DS.attr("number"),
  createDateTime: DS.attr('number'), //创建时间
  createUser: DS.belongsTo('user'), //创建人
  lastUpdateDateTime: DS.attr('number'), //更新时间
  lastUpdateUser: DS.belongsTo('user'), //更新人
  amapLng:DS.attr('number'), //高德地图经度
  amapLat:DS.attr('number'),//高德地图纬度
  roomLng:DS.attr('number'),//硬件经度/y
  roomLat:DS.attr('number'),//硬件经度/x
  positingUser:DS.belongsTo('user'),//定位位置的用户
  timeStr:Ember.computed('locationTime',function(){

  }),
  createTimeDay:Ember.computed("createDateTime",function(){
    var time = this.get("createDateTime");
    // time=time-24*60*60;//库里的时间是同步时间,比实际时间多一天,需要减一天
    return time?this.get("dateService").formatDate(time,"yyyy-MM-dd"):"";
    }),
    createTimeHour:Ember.computed("createDateTime",function(){
      var time = this.get("createDateTime");
      // time=time-24*60*60;//库里的时间是同步时间,比实际时间多一天,需要减一天
      return time?this.get("dateService").formatDate(time,"hh:mm"):"";
      }),
});
