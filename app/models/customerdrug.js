import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var CustomerDrug = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  createDateTime:DS.attr('number'),//创建时间
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新操作者userid
  createUser:DS.belongsTo('user'),//创建者ID
  remark:DS.attr('string'),//备注
  drugNum:DS.attr('number'),//药品数量
  gatherStaff:DS.attr('string'),//缴存人
  customer:DS.belongsTo('customer'),//老人
  drug:DS.belongsTo('drug'),//药品
  exes:DS.hasMany('customerdrugprojectexe'),//对应执行情况
  addFlag:DS.belongsTo('dicttype'),//老人用药添加类型
  addDrugNum:DS.attr('number'),//存取数量
  gatherDate:Ember.computed("createDateTime",function(){
    var gatherDate=this.get("createDateTime");
    return this.get("dateService").formatDate(gatherDate,"yyyy-MM-dd");

  }),//缴存时间
});
export default CustomerDrug;
