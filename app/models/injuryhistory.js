import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var injuryhistory = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
operatInjuryType: DS.belongsTo('dicttype'),
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
injuryName: DS.attr('string'),//外伤名称
injuryTime: DS.attr('number'),//外伤时间
injuryDate:Ember.computed("injuryTime",function(){
  var injuryTime=this.get("injuryTime");
  return this.get("dateService").timestampToTime(injuryTime);
}),
injuryTimeString:Ember.computed("injuryTime",function(){
  var injuryTime=this.get("injuryTime");
  return this.get("dateService").formatDate(injuryTime,"yyyy-MM-dd");
  }),
  operatInjuryTypeCode: Ember.computed('operatInjuryType', function() {
      var code = this.get('operatInjuryType.typecode');
      return code;
  }),
});

export default injuryhistory;
