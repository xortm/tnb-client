import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var dicttypetenant = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  typecode: DS.attr('string'),//编码
  typegroupTenant: DS.belongsTo('typegrouptenant'),//类型分组
  typename: DS.attr('string'),//名称
  remark: DS.attr('string'),//备注
  // tenant:DS.belongsTo('Tenant'),//租户
  typeValue: DS.attr('string'),//日价格
  totalPrice:DS.attr('string'),//月价格 
  realTypeValue:Ember.computed("typeValue",function(){
    var typeValue=this.get("typeValue");
    if(!typeValue){
      typeValue="";
    }
    return typeValue+"元/天";
  })
});
export default dicttypetenant;
