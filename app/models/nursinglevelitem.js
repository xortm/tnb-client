import DS from 'ember-data';
import BaseModel from './base-model';

var Nursinglevelitem = BaseModel.extend({
  level:DS.belongsTo('nursinglevel'),//所属方案
  item:DS.belongsTo('customerserviceitem'),//护理项目
  period:DS.belongsTo('dicttype'),//周期
  frequency:DS.attr('string'),//频次
});

export default Nursinglevelitem;
