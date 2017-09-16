import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*街道*/
export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    name: DS.attr('string'), //名称
    remark: DS.attr('string'), //备注
    tenant: DS.belongsTo('tenant'), //对应租户
    county: DS.belongsTo('county'), //对应区县
});
