import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var operation = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
operatInjuryType: DS.belongsTo('dicttype'),
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
operationName: DS.attr('string'),//手术名称
operationTime: DS.attr('number'),//手术时间
remark: DS.attr('string'),//备注
operationDate:Ember.computed("operationTime",function(){
  var operationTime=this.get("operationTime");
  return this.get("dateService").timestampToTime(operationTime);
}),
operationTimeString:Ember.computed("operationTime",function(){
  var operationTime=this.get("operationTime");
  return this.get("dateService").formatDate(operationTime,"yyyy-MM-dd");
  }),
  operatInjuryTypeCode: Ember.computed('operatInjuryType', function() {
      var code = this.get('operatInjuryType.typecode');
      return code;
  }),
});

export default operation;
