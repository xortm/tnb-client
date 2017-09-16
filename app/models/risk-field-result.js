import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
export default BaseModel.extend({
    pathConfiger: Ember.inject.service("path-configer"),
    dateService: Ember.inject.service("date-service"),
    remark:DS.attr('string'),//描述
    value:DS.attr('string'),//字段值
    field:DS.belongsTo('risk-record-field'),//对应的元数据
    recordResult:DS.belongsTo('risk-record-result'),//对应的风险记录结果
    fieldEnum:DS.belongsTo('risk-field-enum'),//对应的枚举值
    createDateTime: DS.attr('number'), //评估日期
    lastUpdateDateTime:DS.attr('number'),
    fieldId:Ember.computed('field',function(){
      if(!this.get('field')){
        return 0 ;
      }
      return this.get('field.id');
    }),
});
