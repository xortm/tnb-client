import DS from 'ember-data';
import BaseModel from './base-model';

var Nursingplanitem = BaseModel.extend({
  plan:DS.belongsTo('nursingplan',{inverse:'services'}),//所属计划
  item:DS.belongsTo('nursingprojectitem'),//护理项目(护理方案)
  startTime:DS.attr('number'),//开始时间
  endTime:DS.attr('number'),//结束时间
  remark:DS.attr('string'),//备注
  weekTab:DS.attr('number'),//周标记字段
  startTimeTab:DS.attr('number'),//开始服务时间小时标记字段
  endTimeTab:DS.attr('number'),//结束服务时间小时标记字段
  customer:DS.belongsTo('customer'),//老人字段 have/none?
});

export default Nursingplanitem;
