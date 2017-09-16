import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var CustomerDrug = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  customerDrug:DS.belongsTo('customerdrug'),//对应的老人药品
  addDrugNum:DS.attr('number'),//入库或出库数量
  drugNum:DS.attr('number'),//剩余数量
  gatherStaff:DS.attr('string'),//操作人
  addType:DS.belongsTo('dicttype'),//存取类型
  createDateTime:DS.attr('number'),//时间
  createDateTimeStr:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"yyyy-MM-dd hh:mm");

  }),
});
export default CustomerDrug;
