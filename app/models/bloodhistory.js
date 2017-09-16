import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var bloodhistory = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
bloodReasonType : DS.belongsTo('dicttype'),
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
causes: DS.attr('string'),//输血的原因
bloodTime: DS.attr('number'),//输血时间
bloodDate:Ember.computed("bloodTime",function(){
  var bloodTime=this.get("bloodTime");
  return this.get("dateService").timestampToTime(bloodTime);
}),
bloodTimeString:Ember.computed("bloodTime",function(){
  var bloodTime=this.get("bloodTime");
  return this.get("dateService").formatDate(bloodTime,"yyyy-MM-dd");

  }),
  bloodReasonTypeCode: Ember.computed('bloodReasonType', function() {
      var code = this.get('bloodReasonType.typecode');
      return code;
  }),
});
export default bloodhistory;
