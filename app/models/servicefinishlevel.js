import DS from 'ember-data';
import BaseModel from './base-model';

var Serviceitem=BaseModel.extend({
  name:DS.attr('string'),//名称
  remark:DS.attr('string'),//备注
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  item:DS.belongsTo('customerserviceitem'),//所属项目
});

export default Serviceitem;
