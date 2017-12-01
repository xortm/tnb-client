import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  diningDate: DS.attr("number"), //用餐日期
  diningTime: DS.belongsTo('dicttype'), //用餐时间 foodTimeType:  foodTimeType1 早餐   foodTimeType3午餐  foodTimeType5晚餐
  food:DS.belongsTo('food'),//选中菜单关联
  dayPlan:DS.belongsTo('customerdayfoodplan'),//关联customerdayfoodplan
  // planDate: DS.belongsTo('customer'), //用餐老人
  // foodName: DS.attr("number"), //菜单字符串
  customer: DS.belongsTo('customer'), //用餐老人
  createEmployee: DS.belongsTo('employee'), //记录人
  createUser: DS.belongsTo('user'), //创建人
  yearTab: DS.attr("number"), //年
  weekIndex: DS.attr("number"), //周序号
  weekTab: DS.attr("number"), //星期几
  planStatus: DS.belongsTo('dicttype'), //计划状态 pc发布
  confirmStatus: DS.belongsTo('dicttype'), //移动端编辑确认状态
  diningDateStr:Ember.computed("diningDate", function() {
      var diningDate = this.get("diningDate");
      return diningDate?this.get("dateService").formatDate(diningDate, "yyyy-MM-dd"):'无';
  }),
  diningDateFirstStr:Ember.computed("diningDate", function() {
      var diningDate = this.get("diningDate");
      let formatDateStr = this.get("dateService").formatDate(diningDate, "yyyy-MM-dd");
      return this.get("dateService").getFirstSecondStampOfDayString(formatDateStr);
  }),
  foodDayPlan:Ember.computed(function(){
    return this.get("diningTime.id") + "_" + this.get("food.id");
  }),
});
