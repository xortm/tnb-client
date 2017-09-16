import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

/*工单*/
var Workorder = BaseModel.extend({
  dateService:Ember.inject.service('date-service'),

  code: DS.attr('string'),
  title: DS.attr('string'),//工单标题
  type: DS.attr('number'),//类型
  desc: DS.attr('string'),//描述信息
  isSuccess:DS.attr('number'),//是否成单 1已成单 0未成单 2确认成单 3已冻结
  followTime:DS.attr('number'),//跟进日期
  updateTime:DS.attr('number'),//更新时间
  createTime:DS.attr('number'),//创建时间
  completeTime:DS.attr('number'),//确认成单时间
  tbcTime:DS.attr('number'),//待确认时间(成单时间)
  customer: DS.belongsTo('customer'), //对应客户
  task:DS.belongsTo('task'),//对应任务
  creater:DS.belongsTo('user'),//对应创建工单的客服
  //call: DS.belongsTo('call'),//对应通话 null
  header:DS.belongsTo('user'),//负责人
  concerned:DS.hasMany('user'),//关注的人
  freezeReason:DS.attr('string'),//冻结原因

  followTimeShow: Ember.computed('followTime',function(){
    return this.showtime(this.get('followTime'));
  }),
  createTimeShow: Ember.computed('createTime',function(){
    return this.showtime(this.get('createTime'));
  }),
  updateTimeShow: Ember.computed('updateTime',function(){
    return this.showtime(this.get('updateTime'));
  }),
  completeTimeShow: Ember.computed('completeTime',function(){
    return this.showtime(this.get('completeTime'));
  }),
  isSuccessStr:Ember.computed('isSuccess',function(){//在客户端使用
    if(this.get('isSuccess')===0){
      return '未成单';
    }
    if(this.get('isSuccess')===1){
      return '待确认';
    }
    if(this.get('isSuccess')===2){
      return '已确认';
    }
    if(this.get('isSuccess')===3){
      return '已冻结';
    }
  }),
  showtime:function(dateOri){
    var date = new Date(dateOri*1000);
    date=this.get("dateService").formatDate(dateOri,"yyyy-MM-dd hh:mm:ss");
    return date;
  },
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
Workorder.reopenClass({
  FIXTURES: [
    {
      id: 1,
      code: "001",
      title: "用户要求送件",
      desc:"一个大件，一个小件",
      customer:1,
      call:1
    }
  ]
});
export default Workorder;
