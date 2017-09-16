import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

let CustomerPreference =  BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  customer:DS.belongsTo('customer'),//所属老人
  remark:DS.attr('string'),//描述
  type:DS.belongsTo('dicttype'),
  name:DS.attr('string'),//名称
  startTime:DS.attr('number'),//开始时间
  endTime:DS.attr('number'),//结束时间
  startDate:Ember.computed('startTime',function(){
    let startTime = this.get("startTime");
    return startTime?this.get("dateService").timestampToTime(startTime):null;
  }),
  startStr:Ember.computed('startTime',function(){
    var startTime=this.get("startTime");
    return startTime?this.get("dateService").formatDate(startTime,"hh:mm"):null;
  }),
  startNum:Ember.computed('startStr',function(){
    let startStr = this.get('startStr');
    if(startStr){
      // let num = Number(startStr.split(':')[0]);
      var num = Number(startStr.replace(/:/,""));
      console.log('startNum',num);
      return num;
    }
  }),
});
export default CustomerPreference;
