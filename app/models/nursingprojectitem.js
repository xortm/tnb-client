import DS from 'ember-data';
import BaseModel from './base-model';

var Nursingprojectitem = BaseModel.extend({
  project:DS.belongsTo('nursingproject'),//所属方案
  referencePrice :DS.attr('string'),//价格(实际消费价格)
  item:DS.belongsTo('customerserviceitem'),//护理项目
  period:DS.belongsTo('dicttype'),//周期
  service_time:DS.attr('string'),//时长
  frequency:DS.attr('string'),//频次
});

export default Nursingprojectitem;
