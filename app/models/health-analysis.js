import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  tenant: DS.belongsTo('tenant'), //租户
  createTime: DS.attr('number'), //创建时间
  contents: DS.attr('string'), //基本建议
  mul_contents: DS.attr('string'), //综合建议
  customer:DS.belongsTo('customer'),//用户
  type:DS.belongsTo('dicttype'),//类型
  createDate: Ember.computed("createTime", function() {
      var createTime = this.get("createTime");
      return this.get("dateService").timestampToTime(createTime);
  }),
  createTimeString: Ember.computed("createTime", function() {
      var createTime = this.get("createTime");
      return this.get("dateService").formatDate(createTime, "yyyy-MM-dd hh:mm:ss");

  }),
});
