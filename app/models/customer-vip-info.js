import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
//会员信息
var customervipinfo = BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    vipNum: DS.attr("string"), //会员编号
    level: DS.belongsTo('dicttype'), //会员等级
    active: DS.attr("number"), //会员活跃
    points: DS.attr("number"), //会员积分
    customer:DS.belongsTo('customer'),//对应的老人
});
export default customervipinfo;
