import Model from 'ember-data/model';
import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  worktime:DS.belongsTo('worktime'),//对应时间段
  userTask: DS.belongsTo('userTask'),//对应用户任务
  signStatus: DS.attr("number"),//签到情况 1已签到2未签到 0未申请
  runStatus: DS.attr("number"),//任务进行情况 1未开始2已结束3进行中   0未运行1进行中

  /*签到状态显示*/
  signStatusString: Ember.computed('signStatus',function(){
    if(this.get("signStatus")===1){
      return "已签到";
    }
    if(this.get("signStatus")===2){
      return "未签到";
    }
    if(this.get("signStatus")===0){
      return "未申请";
    }
  }),
  /*任务进行情况 显示*/
  runStatusString: Ember.computed('runStatus',function(){
    console.log('isRunningChinese',this.get('runStatus'));
    if(this.get("runStatus")===1){
      return "未开始";
    }
    if(this.get("runStatus")===2){
      return "已结束";
    }
    if(this.get("signStatus")===3){
      return "进行中";
    }
  }),
  isRunning:Ember.computed('runStatus',function(){
    console.log('isRunning',this.get('runStatus'));
    if(this.get("runStatus")===1){
      return true;
    }
    return false;
  }),
});
