import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

/*
 * 保持连接的帮助model
 * @author liangmuxue
 */
export default BaseModel.extend({
  result: DS.attr('string'),
});
