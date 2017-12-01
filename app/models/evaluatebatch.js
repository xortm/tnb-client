import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*评估问卷主表*/
export default BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    dateService: Ember.inject.service("date-service"),
    createUser:DS.belongsTo('user'),//创建人
    lastUpdateUser:DS.belongsTo('user'),//更新操作者user id
    createDateTime: DS.attr('number'),//创建时间
    lastUpdateDateTime: DS.attr('number'),//更改时间
    user:DS.belongsTo('employee'),//评估人
    customer:DS.belongsTo('customer'),//评估老人
    batch: DS.attr('number'),//批次
    remark: DS.attr('string'), //备注
    doneFlag:DS.attr('number'),//完成状态，1，完成，0，未完成
    actionLevel:DS.belongsTo('dicttype'),//自理等级
    level:DS.belongsTo('nursinglevel'),//护理等级
    // results:DS.hasMany('evaluateresult'),
    createDate: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").timestampToTime(createDateTime);
    }),
    createDateTimeString: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd");
    }),
    doneFlagName:Ember.computed('doneFlag',function(){
      let doneFlag = this.get('doneFlag');
      if(doneFlag==0){
        return '问卷未完成';
      }else if(doneFlag == 1){
        return '问卷已完成';
      }else{
        return '已答完';
      }
    }),
});
