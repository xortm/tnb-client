import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  pathConfiger: Ember.inject.service("path-configer"),
  createTime:DS.attr('number'),//创建时间
  isTaken:DS.attr('number'),//是否用药   0:否   1:是
  isInTime:DS.attr('number'),//是否按时用药   0:否   1:是
  customer:DS.belongsTo('customer'),//用户
  createTimeStr:Ember.computed("createTime",function(){
    var createTime = this.get("createTime");
    return this.get("dateService").formatDate(createTime,"yyyy-MM-dd hh:mm");
  }),

});
