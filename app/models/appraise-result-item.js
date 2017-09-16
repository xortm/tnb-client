import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
      dateService: Ember.inject.service('date-service'),
      name: DS.attr('string'), //名称
      result:DS.belongsTo("appraise-result"),//评价结果
      item:DS.belongsTo("appraise-item"),//评价结果
      score:DS.attr("number"),//分数
      remark:DS.attr("string"),//备注
});
