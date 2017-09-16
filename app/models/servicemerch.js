import DS from 'ember-data';
import BaseModel from './base-model';

var Serviceitem=BaseModel.extend({
  item:DS.belongsTo('customerserviceitem'),//所属护理项目
  merch:DS.belongsTo('nursemerch'),//医护物品
  merchNum:DS.attr('number'),//数量
});

export default Serviceitem;
