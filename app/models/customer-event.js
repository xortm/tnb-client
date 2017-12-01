import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  name: DS.attr('string'),
  customer: DS.belongsTo("customer"),
  eventTime:DS.attr("number"),
  type:DS.belongsTo("dicttype"),//code eventType
  eventFlag:DS.attr("number"),// 0自动生成1手动新增
  remark:DS.attr("string"),
  eventTimeStr: Ember.computed("eventTime", function() {
    var time = this.get("eventTime");
    return time ? this.get("dateService").formatDate(time, "yyyy-MM-dd") : null;
  }),
  eventTimeDate:Ember.computed("eventTime",function(){
    var time=this.get("eventTime");
    return time?this.get("dateService").timestampToTime(time):null;
  }),
});
