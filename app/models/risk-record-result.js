import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
export default BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    dateService: Ember.inject.service("date-service"),
    customer: DS.belongsTo('customer'), //老人姓名
    name: DS.attr('string'),
    model: DS.belongsTo('risk-record-model'), //记录模板
    recordTime:DS.attr('number'),//记录时间
    createDateTime: DS.attr('number'), //创建日期
    lastUpdateDateTime:DS.attr('number'),
    remark:DS.attr('string'), //问卷备注
    user:DS.belongsTo('employee'),//记录人
    //
    // completeStatus:DS.attr('number'),//问卷完成状态，0，未完成，1，已完成
    // completeName:Ember.computed('completeStatus',function(){
    //   let completeStatus = this.get('completeStatus');
    //   if(completeStatus==1){
    //     return '已完成';
    //   }else{
    //     return '未完成';
    //   }
    // }),
    recordTimeStr: Ember.computed("recordTime", function() {
        var recordTime = this.get("recordTime");
        return recordTime?this.get("dateService").formatDate(recordTime, "yyyy-MM-dd"):null;
    }),
    createDateTimeStr: Ember.computed("createDateTime", function() {
        var createDateTime = this.get("createDateTime");
        return createDateTime?this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd"):null;
    }),

});
