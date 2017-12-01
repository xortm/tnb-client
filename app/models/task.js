import DS from 'ember-data';
import Ember from 'ember';
import format from 'ember-moment/computeds/format';
import BaseModel from './base-model';

export default BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService:Ember.inject.service('date-service'),

  code: DS.attr('string'),//任务编码
  title: DS.attr('string'),//任务标题
  iconFile: DS.attr('string'),//图标文件
  durType: DS.attr('number'),//任务时间类型，1长期2短期
  callType:DS.attr('number'),//任务呼叫类型，1外呼2综合
  desc: DS.attr('string'),//描述信息
  beginTime:DS.attr('number'),//起始日期
  endTime:DS.attr('number'),//结束日期
  createTime:DS.attr('number'),//创建时间
  updateTime:DS.attr('number'),//更新时间
  worktimes: DS.hasMany('worktime'), //工作时间段
  onlinePay:DS.attr('number'),//在线时长报酬（单位为小时）
  callinPay:DS.attr('number'),//接听报酬（单位为每次）
  calloutPay:DS.attr('number'),//外呼报酬（单位为每次）
  poPay:DS.attr('number'),//成单报酬（单位为每单）
  pubuser: DS.belongsTo('user',{inverse:null}), //发布任务的用户,
  isCheckin: DS.attr('number'),//是否已签入1是0否
  status: DS.belongsTo('dicttype'),//任务状态 group为2
  runstatus: DS.attr('number'),//进行状态 1已开始，0不在运行
  taskTypes: DS.hasMany('dicttype'),//任务标签，1电销2客服...
  extendIfo: DS.belongsTo('taskextend'),//对应的扩展信息，如人员配置等
  verifyFailReason: DS.attr('string'),//任务申请失败的原因
  language:DS.hasMany('dicttype'),//任务要求的语种
  explicitNum:DS.attr('string'),//外显号码
  explicitApplyFile:DS.attr('string'),//外显号码申请材料路径
  sexPreference:DS.attr('number'),//性别要求 0 不限  1 男   2女
  imsPool:DS.belongsTo('imsPool'),//总机号码
  settleAccountWay:DS.attr('number'),//0实时（默认） 1任务结束后
  //csneed:DS.attr('number'),//需要的人员数量
  settleAccountWayString:Ember.computed('settleAccountWay',function(){
    var settleAccountWay = this.get('settleAccountWay');
    if(settleAccountWay == 0){
      return '实时';
    }
    else {
      return '1任务结束后';
    }
  }),
  sexPreferenceStr:Ember.computed('sexPreference',function(){
    var sex = this.get('sexPreference');
    if(sex == 0){
      return '不限';
    }
    else if(sex == 1){
      return '男';
    }
    else if(sex == 2){
      return '女';
    }
  }),
  CRL_showStatus:Ember.computed(function(){
    return 0;
  }),//控制属性，显示的状态，0：不显示 1：显示申请按钮 2：显示已申请 3：显示已在任务中

  worktimeString:Ember.computed('worktimes.[]',function(){//告诉Ember worktimes是个数组
    var _self = this;
    var worktimes = _self.get('worktimes').sortBy('section');
    var worktimestring = worktimes.reduce(function(previousValue,worktime){
      return previousValue + worktime.get('beginHour')+":00~" + worktime.get('endHour')+":00  ";
    },"");
    console.log('worktimestring',worktimestring);
    return worktimestring;
  }),

  durtypeStr: Ember.computed(function(){
    if(this.get('durType')===1){
      return "长期";
    }
    return "短期";
  }),
  calltypeStr: Ember.computed(function(){
    if(this.get('callType')===1){
      return "外呼";
    }
    else if (this.get('callType')===2) {
      return "综合";
    }
    return "";
  }),
  beginDateComp: Ember.computed('beginTime',function(){
    var dateOri = this.get("beginTime");
    var date = new Date(dateOri*1000);
    //return date;
    //return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    if(date == 'Invalid Date'){
      date = '';
    }
    else{
      date=this.get("dateService").formatDate(dateOri,"yyyy-MM-dd");
    }
    return date;
  }),
  endDateComp: Ember.computed('endTime',function(){
    var dateOri = this.get("endTime");
    var date = new Date(dateOri*1000);
    console.log('=============================================='+date);
    if(date == 'Invalid Date'){
      date = '待定';
    }
    else{
      // date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
      date = this.get("dateService").formatDate(dateOri,"yyyy-MM-dd");
    }
    return date;
  }),
  updateTimeComp:Ember.computed('updateTime',function(){
    var dateOri = this.get("updateTime");
    var date = new Date(dateOri*1000);
      date=this.get("dateService").formatDate(dateOri,"yyyy-MM-dd");
    return date;
  }),
  avatarUrl:Ember.computed('iconFile',function(){
      var iconFile = this.get("iconFile");
      if(!iconFile){
        iconFile = "anonymous.png";
        // iconFile = this.get("pathConfiger").getQual.ificationImgRemotePath(iconFile);.
        // return ;
        // return iconFile;
      }
      console.log("this.pathConfiger",iconFile);
      return this.get("pathConfiger").getTaskiconRemotePath(iconFile);
  }),
});
