import Model from 'ember-data/model';
import BaseModel from './base-model';

export default BaseModel.extend({
  typecode:DS.attr('string'),
  typename:DS.attr('string'),
  typegroup:DS.belongsTo('typegroup'),//所属分组
  remark:DS.attr('string'),
  sort:DS.attr('number'),//排序
  operateType:DS.attr('string'),//字符串，用来存储设备类型
  realRemark:Ember.computed('remark',function(){
    var remark=this.get('remark');
    if(remark){
      return parseInt(remark);
    }
  })
});
