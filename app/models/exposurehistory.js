import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var exposurehistory = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
exposureType:DS.belongsTo('dicttype'),//暴露史的类别 exposureType
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
remark: DS.attr('string'),//备注
exposureTypeCode:Ember.computed('exposureType',function(){
  var code=this.get('exposureType.typecode');
  return code;
}),
});

export default exposurehistory;
