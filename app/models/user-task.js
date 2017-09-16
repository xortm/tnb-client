import Ember from 'ember';
import DS from 'ember-data';
import BaseModel from './base-model';
import moment from 'moment';

/*
* 用户任务表
*/
export default BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  clock: Ember.inject.service('clock-timer'),

  code: DS.attr('string'),
  createTime: DS.attr('number'),//领取时间
  effectiveTime: DS.attr('number'),//生效时间
  channel:DS.attr('number'),//渠道：1被站内邀请 2被站外邀请 3申请通过
  user:DS.belongsTo('user'),//对应用户
  task: DS.belongsTo('task'),//对应任务
  status: DS.belongsTo('dicttype'),//任务状态,对应字典的code: taskApply-已申请 taskApplySucc-已通过
  signstatus: DS.attr('number'),//签到状态 1-已签到 0未签到
  clientSigntime: DS.attr('number'),//本次签到的客户端时间
  bindPhone:DS.attr('string'),//客服针对此任务绑定的电话号码
  applyWorktimes:DS.hasMany("applyWorktime"),//对应的工作时段
  todayCallinCount:DS.attr('number'), // 今日呼入数量
  todayCalloutCount:DS.attr('number'),// 今日呼出数量
  nearestSigninTime:DS.attr('number'),// 最近签入时间
  nearestSignoutTime:DS.attr('number'),// 最近签出时间
  verifyFailReason: DS.attr('string'),//任务申请失败的原因
  imsPool:DS.belongsTo('imsPool'),//坐席号码
  isSettleAccount:DS.attr('number'),// 是否已结算 0 未结算   1 未结算
  /*进行状态显示*/
  runStatusString: Ember.computed('runStatus',function(){
    console.log('taskrunstatusget string',this.get('runStatus'));
    if(this.get("runStatus")===1){
      return "已签到";
    }
    if(this.get("runStatus")===2){
      return "待签到";
    }
    if(this.get("runStatus")===3){
      return "未开始";
    }
  }),
  //进行状态 1 已签到 2待签到 3未开始
  runStatus: Ember.computed('task.runstatus','signstatus',function(){
    console.log('taskrunstatusget',this.get('task.runstatus'));
    if(this.get('task.runstatus')===1){
      if(this.get("signstatus")===1){
        return 1;
      }
      return 2;
    }else{
      return 3;
    }
  }),
  /*签到的计时秒数*/
  signSeconds: Ember.computed('clientSigntime', 'clock.time',function(){
    if(!this.get("clientSigntime")){
      return 0;
    }
    var timeDiff = this.get('clock.time') - this.get('clientSigntime')*1000;
    return timeDiff/1000;
  }),
  /*显示签到的计时*/
  signDatetime: Ember.computed('signSeconds',function(){
    var time = moment.duration(this.get("signSeconds"), "seconds");
    console.log('duration',time);
    if(time<60*1000){
      console.log('111111',time);
      return "00:00:"+time.format("hh:mm:ss");
    }
    else if(time<3600*1000 && time>=60*1000){
      console.log('1111112',time);
      return "00:"+time.format("hh:mm:ss");
    }
    else{
      console.log('1111113',time);
      return time.format("hh:mm:ss");
    }

  }),
  nearestSigninTimeStr:Ember.computed("nearestSigninTime",function(){
    var str;
    if(!this.get("nearestSigninTime")){
      str = '';
    }
    else {
      str = this.get("dateService").formatDate(this.get("nearestSigninTime"),"yyyy-MM-dd hh:mm:ss");
    }
    return str;
  }),
  nearestSignoutTimeStr:Ember.computed("nearestSignoutTime",function(){
    var str;
    if(!this.get("nearestSignoutTime")){
      str = '';
    }
    else {
      str = this.get("dateService").formatDate(this.get("nearestSignoutTime"),"yyyy-MM-dd hh:mm:ss");
    }
    return str;
  }),
});
