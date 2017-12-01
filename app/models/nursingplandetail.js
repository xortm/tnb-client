import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  item:DS.belongsTo('nursingprojectitem'),//护理项目
  yearTab:DS.attr('number'),//年
  weekTab:DS.attr('number'),//周几
  weekIndex:DS.attr('number'),//周序号
  startTimeTab:DS.attr('string'),//开始服务时间小时标记字段
  customer:DS.belongsTo('customer'),//老人
  plan:DS.belongsTo('customernursingplan'),
  dayPlanNum:DS.attr('number'),//日项目数
  weekPlanNum:DS.attr('number'),//周项目数
  weekCounts:DS.attr('number'),//周项目次数
  remark:DS.attr('string'),//项目名称
// 为居家养老添加的字段
  serviceStatus:DS.belongsTo('dicttype'), //订单  状态   待接单   已接单  在路上  完成
  serviceTime:DS.attr('number'),//订单  服务时间
  servicePrice:DS.attr('number'),//服务价格
  serviceOperater:DS.belongsTo('employee'), //服务接单人
  serviceTel:DS.attr('string'),//预约人电话
  serviceAddress:DS.attr('string'),//预约人地址
  paymentType:DS.belongsTo('dicttype'), //支付方式

  createDateTimeStr:Ember.computed("createDateTime", function() {
      var createDateTime = this.get("createDateTime");
      return createDateTime?this.get("dateService").formatDate(createDateTime, "yyyy-MM-dd hh:mm"):'无';
  }),
  serviceTimeStr:Ember.computed("serviceTime", function() {
      var serviceTime = this.get("serviceTime");
      return serviceTime?this.get("dateService").formatDate(serviceTime, "yyyy-MM-dd hh:mm"):'无';
  }),

});
