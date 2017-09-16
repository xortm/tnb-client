import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var drugallegy = BaseModel.extend({
    dateService: Ember.inject.service("date-service"),
    diseaseType: DS.belongsTo('dicttype'),
    healthrecord: DS.belongsTo('healthrecord'), //所对应健康档案表的id
    tumourRemark: DS.attr('string'), //肿瘤备注
    occupationRemark: DS.attr('string'), //职业病备注
    otherRemark: DS.attr('string'), //其他备注
    diseaseTypeCode: Ember.computed('diseaseType', function() {
        var code = this.get('diseaseType.typecode');
        return code;
    }),
});

export default drugallegy;
