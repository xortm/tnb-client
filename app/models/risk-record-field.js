import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  name:DS.attr('string'),//名称
  remark:DS.attr('string'),//描述
  valueType:DS.belongsTo('dicttype'),//字段类型
  parent:DS.belongsTo('risk-record-field',{inverse:'children'}),//父字段
  children:DS.hasMany('risk-record-field',{inverse:'parent'}),
  max:DS.attr('number'),//最大值
  min:DS.attr('number'),//最小值
  model:DS.belongsTo('risk-record-model'),//所属模板
  sort:DS.attr('number'),//序号
  hasChild:Ember.computed('children',function(){
    let children = this.get('children');
    if(children.get('length')>0){
      return true;
    }else{
      return false;
    }
  }),
  childrenList:Ember.computed('children',function(){
    return this.get('children').sortBy('sort');
  }),
});
