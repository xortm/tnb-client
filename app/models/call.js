import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';
import BaseModel from './base-model';

/*通话*/
var Call = BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  pathConfiger: Ember.inject.service("path-configer"),

  code: DS.attr('string'),
  callId: DS.attr('string'),
  callingNumber: DS.attr('string'),//呼入
  calledNumber: DS.attr('string'),//呼出
  voiceRecording:DS.attr('string'),//通话录音URL
  direction: DS.attr('number'),//类型:呼入1,呼出2
  beginTime: DS.attr('number'),
  createTime:DS.attr('number'),//创建时间
  endTime: DS.attr('number'),
  duration: DS.attr('number'),//通话时长，单位：秒
  operation: DS.belongsTo('dicttype'),
  status: DS.belongsTo('dicttype'), //通话状态，等待接听,通话中,通话结束,未接通
  customer: DS.belongsTo('customer'),//对应客户
  agent: DS.belongsTo('user'),//对应客服
  task: DS.belongsTo('task'),
  cost:DS.attr('number'),//当前通话费用
  sessonId:DS.attr('string'),//
  participatId:DS.attr('string'),//


  calledNumberHidden:Ember.computed('calledNumber',function(){
    var phoneStr = this.get('calledNumber');
    phoneStr = phoneStr.substring(0,3)+'****'+phoneStr.substring(7);
    return phoneStr;
  }),
  audioUrl: Ember.computed("voiceRecording",function() {
    var audio = this.get("voiceRecording");
    if(!audio){
      return "";
    }
    console.log("this.pathConfiger",this.get("pathConfiger"));
    return this.get("pathConfiger").getAudioRemotePath(audio);
  }),

  isCallin: Ember.computed("direction",function(){
    if(this.get('direction')===1){
      return true;
    }
    return false;
  }),
  directionStr: Ember.computed("direction",function(){
    if(this.get('direction')===1){
      return "来电";
    }
    return "去电";
  }),
  //取出客户号码
  customerNumber: Ember.computed("direction","callingNumber","calledNumber",function(){
    if(this.get('direction')===1){
      return this.get("callingNumber");
    }
    return this.get("calledNumber");
  }),
  customerNumberHidden: Ember.computed("direction","callingNumber","calledNumber",function(){
    if(this.get("callingNumber")&&this.get('direction')===1){
      return this.get("callingNumber").substring(0,3)+'****'+this.get("callingNumber").substring(7);
    }
    else if (this.get("calledNumber")) {
      return this.get("calledNumber").substring(0,3)+'****'+this.get("calledNumber").substring(7);
    }
    return '';
  }),
  //取出客服号码
  csNumber: Ember.computed("direction","callingNumber","calledNumber",function(){
    if(this.get('direction')===2){
      return this.get("callingNumber");
    }
    return this.get("calledNumber");
  }),
  createTimeStr:Ember.computed("createTime",function(){
    var str;
    if(!this.get("createTime")){
      str = '';
    }
    else {
      str = this.get("dateService").formatDate(this.get("createTime"),"MM-dd hh:mm");
    }
    return str;
  }),
  beginTimeStr:Ember.computed("beginTime",function(){
    var str;
    if(!this.get("beginTime")){
      str = '';
    }
    else {
      str = this.get("dateService").formatDate(this.get("beginTime"),"MM-dd hh:mm");
    }
    return str;
  }),
  endTimeStr:Ember.computed("endTime",function(){
    var str;
    if(!this.get("endTime")){
      str = '';
    }
    else {
      str = this.get("dateService").formatDate(this.get("endTime"),"MM-dd hh:mm");
    }
    return str;
  }),
  durationDisplay:Ember.computed("duration",function(){
    var time = moment.duration(this.get("duration"), "seconds");
    console.log('duration time',time);
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
});

export default Call;
