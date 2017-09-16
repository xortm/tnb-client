import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
code: DS.attr('string'),
phoneNumber: DS.attr('string'),//号码
remark: DS.attr('string'),//备注
});
