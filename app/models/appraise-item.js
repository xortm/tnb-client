import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
      dateService: Ember.inject.service('date-service'),
      name: DS.attr('string'), //名称
      maxScore:DS.attr("number"),//最大分数
      appraise:DS.hasMany('appraise'),//评价
      remark:DS.attr("string"),//备注
      type:DS.belongsTo("dicttype"),//类型
});
