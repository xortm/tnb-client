import DS from 'ember-data';
import BaseModel from './base-model';
/*
* 任务扩展信息
*/
export default BaseModel.extend({
  code: DS.attr('string'),
  money: DS.attr('number'),//任务使用金额
  calloutNum:DS.attr('number'),//全部外呼数量
  callinNum:DS.attr('number'),//全部内呼数量
  callinAveDuration:DS.attr('number'),//呼入平均时长，单位：秒
  calloutAveDuration:DS.attr('number'),//呼出平均时长，单位：秒
  csNeed:DS.attr('number'),//需要客服数量
  csHave:DS.attr('number'),//已招客服数量

  isFull:Ember.computed('csNeed','csHave',function(){
    console.log('csNeed',this.get('csNeed'));
    console.log('csHave',this.get('csHave'));
    if(this.get('csNeed') === this.get('csHave')){
        return '1';
    }
    else {
      return '0';
    }
  }),
  csRemain:Ember.computed('csNeed','csHave',function(){
    return this.get('csNeed')-this.get('csHave');
  }),
});
