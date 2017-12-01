import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  device:DS.belongsTo('device'),//对应设备
  bed:DS.belongsTo('bed'),//对应老人
  room:DS.belongsTo('room'),//对应房间
  camera:DS.belongsTo('camera')
});
