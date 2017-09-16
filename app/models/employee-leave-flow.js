import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dataLoader: Ember.inject.service("data-loader"),
  dateService: Ember.inject.service('date-service'),
  applyTime: DS.attr("number"),//申请时间
  expectStartTime: DS.attr("number"),//开始时间
  expectEndTime: DS.attr("number"),//预计结束时间
  realEndTime: DS.attr("number"), //实际结束时间
  applicant: DS.belongsTo("employee"),//申请人
  remark: DS.attr("string"),//审批意见
  reason: DS.attr("string"),//请假原因
  type: DS.belongsTo('dicttype'),//请假类型
  flowStatus: DS.attr("number"),//流程状态 0已申请1审批已通过2审批未通过 99已完成
  approver: DS.belongsTo("employee"),//审批人
  approveTime: DS.attr("number"),//审批时间
  result:DS.attr("number"),//审批结果0未通过1已通过
  leaveDay:DS.attr('string'),
  statusStr:Ember.computed('flowStatus',function(){
    let _self = this;
    let expectStartTime = this.get('expectStartTime');
    let nowTime = _self.get("dataLoader").getNowTime();
    console.log('请假时间:',expectStartTime,'当前时间：',nowTime);
    let status = this.get('flowStatus');
    if(status === 0){
      return '已申请';
    }
    if(status == 1){
      if(nowTime>=expectStartTime){
        return '请假中';
      }else{
        return '审批通过';
      }
    }
    if(status == 2){
      return "审批未通过";
    }
    if(status ==99){
      return "已完成";
    }
  }),
  applyTimeDate:Ember.computed('applyTime',function(){
    let applyTime = this.get('applyTime');
    return this.get('dateService').timestampToTime(applyTime);
  }),
  applyTimeStr:Ember.computed('applyTime',function(){
    let applyTime = this.get('applyTime');
    return this.get('dateService').formatDate(applyTime,"yyyy-MM-dd");
  }),
  expectStartTimeDate:Ember.computed('expectStartTime',function(){
    let expectStartTime = this.get('expectStartTime');
    return expectStartTime?this.get('dateService').timestampToTime(expectStartTime):null;
  }),
  expectStartTimeStr:Ember.computed('expectStartTime',function(){
    let expectStartTime = this.get('expectStartTime');
    return this.get('dateService').formatDate(expectStartTime,"yyyy-MM-dd");
  }),
  expectEndTimeDate:Ember.computed('expectEndTime',function(){
    let expectEndTime = this.get('expectEndTime');
    return expectEndTime?this.get('dateService').timestampToTime(expectEndTime):null;
  }),
  expectEndTimeStr:Ember.computed('expectEndTime',function(){
    let expectEndTime = this.get('expectEndTime');
    return expectEndTime?this.get('dateService').formatDate(expectEndTime,"yyyy-MM-dd"):null;
  }),
  realEndTimeDate:Ember.computed('realEndTime',function(){
    let realEndTime = this.get('realEndTime');
    return realEndTime?this.get('dateService').timestampToTime(realEndTime):null;
  }),
  realEndTimeStr:Ember.computed('realEndTime',function(){
    let realEndTime = this.get('realEndTime');
    return realEndTime?this.get('dateService').formatDate(realEndTime,"yyyy-MM-dd"):'无';
  }),
});
