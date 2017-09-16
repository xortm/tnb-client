import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({//轨迹表
  customer: DS.belongsTo('customer'),//老人
  room: DS.belongsTo('room'),//所在房间
  employee: DS.belongsTo('employee'),//员工
  remark:DS.attr('string'), 


});
