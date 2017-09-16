import DS from 'ember-data';
import BaseModel from './base-model';

var Eva = BaseModel.extend({
    createDateTime: DS.attr('number'), //创建时间
    createUser: DS.belongsTo('user'), //创建人
    lastUpdateDateTime: DS.attr('number'), //更新时间
    lastUpdateUser: DS.belongsTo('user'), //更新人
    model:DS.belongsTo('evaluatemodel'),//所属模板
    content:DS.attr('string'),//建议
    level:DS.belongsTo('nursinglevel'),//所属护理等级
    minScore:DS.attr('number'),//最低分数
    maxScore:DS.attr('number'),//最高分数
    remark: DS.attr('string'), //备注
});

export default Eva;
