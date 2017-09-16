import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var diseasecondition = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
disabledType:DS.belongsTo('dicttype'),
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
remark: DS.attr('string'),
disabledTypeCode: Ember.computed('disabledType', function() {
    var code = this.get('disabledType.typecode');
    return code;
}),
});
export default diseasecondition;
