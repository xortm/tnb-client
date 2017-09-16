import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var drugallegy = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
drugAllegyType:DS.belongsTo('dicttype'),//药物过敏史的类别 drugAllegyType
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
remark: DS.attr('string'),//备注
drugAllegyTypeCode:Ember.computed('drugAllegyType',function(){
  var code=this.get('drugAllegyType.typecode');
  return code;
}),
});

export default drugallegy;
