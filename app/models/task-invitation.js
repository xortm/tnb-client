import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  customerService: DS.belongsTo('user'),  //客服
  task: DS.belongsTo('task'), //任务
  remark: DS.attr('string'),//备注
  status: DS.belongsTo('dicttype'),//邀请状态
});
