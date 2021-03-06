import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*区县*/
export default BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    pathConfiger: Ember.inject.service("path-configer"),
    name: DS.attr('string'), //名称
    remark: DS.attr('string'), //备注
    tenant: DS.belongsTo('tenant'), //对应租户
    city: DS.belongsTo('city'), //对应城市
});
