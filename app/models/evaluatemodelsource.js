import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
    createDateTime: DS.attr('number'), //创建时间
    createUser: DS.belongsTo('user'), //创建人
    lastUpdateDateTime: DS.attr('number'), //更新时间
    lastUpdateUser: DS.belongsTo('user'), //更新人
    name:DS.attr('string'),//名称
    types:DS.hasMany('evaluatemodeltype'),//评估类型
    remark: DS.attr('string'), //备注
});
