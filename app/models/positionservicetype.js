import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
    position: DS.hasMany('dicttype'),//职位
    serviceType: DS.hasMany('dicttype'),//护理类别
    tenant:DS.belongsTo("tenant"),//对应租户
    delStatus:DS.attr("number"),

});
