import Model from 'ember-data/model';
import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  beginHour: DS.attr('number'),//开始时间（点钟）
  endHour: DS.attr('number'),//结束时间（点钟）
  section:DS.attr('number'),//时间段排序

  /*时间间隔显示*/
  timeDurString: Ember.computed('beginHour','endHour',function(){
    return this.get("beginHour") + ":00-" + this.get("endHour") + ":00";
  }),
  /*时段显示*/
  sectionHmString: Ember.computed('section',function(){
    if(this.get("section")===1){
      return "第一时段";
    }
    if(this.get("section")===2){
      return "第二时段";
    }
    if(this.get("section")===3){
      return "第三时段";
    }
  }),
});
