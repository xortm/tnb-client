import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
var familyhistory = BaseModel.extend({
dateService: Ember.inject.service("date-service"),
homeHistoryType:DS.belongsTo('dicttype'),
homeManType:DS.belongsTo('dicttype'),
healthrecord:DS.belongsTo('healthrecord'),//所对应健康档案表的id
remark: DS.attr('string'),
homeHistoryTypeCode: Ember.computed('homeHistoryType', function() {
    var code = this.get('homeHistoryType.typecode');
    return code;
}),
});
export default familyhistory;
