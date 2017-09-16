import Ember from 'ember';
import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  cs:DS.belongsTo('user'),//对应客服
  customer:DS.belongsTo('customer'),//对应客户
  status: DS.attr('number'),//完成状态 1已完成0未完成
  createTime: DS.attr('number'),//创建时间
  createTimeStr: Ember.computed("createTime",function(){
    var str;
    if(!this.get("createTime")){
      str = '';
    }
    else {
      str = this.get("dateService").formatDate(this.get("createTime"),"MM-dd hh:mm");
    }
    return str;
  }),
});
