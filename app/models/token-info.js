import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
      token: DS.attr('string'), //名称
      loginStatus: DS.attr('number')
});
