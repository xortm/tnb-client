import DS from 'ember-data';
import BaseModel from './base-model';
export default BaseModel.extend({
      name: DS.attr('string'), //名称
      level:DS.attr('number'),//等级
      parent:DS.belongsTo('assessment-indicator', {
          inverse: 'children'
      }),//父级
      children:DS.hasMany('assessment-indicator', {
          inverse: 'parent'
      }),//子级
      maxScore:DS.attr('number'),//最高分
      remark:DS.attr('string'),//备注
});
