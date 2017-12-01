import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  dateService:Ember.inject.service('date-service'),
  createDateTime:DS.attr('number'),//创建时间
  remark:DS.attr('string'),//备注
  goods:DS.belongsTo('cargo'),//物品
  unitPrice:DS.attr('number'),//单价
  totalPrice:DS.attr('number'),//总价
  purchaseNum:DS.attr('number'),//数量
  purchaseType:DS.belongsTo('dicttype'),//采购类型
  purchaseTime:DS.attr('number'),//采购时间
  purchaseTimeDate:Ember.computed('purchaseTime',function(){
    var purchaseTimeDate = this.get("purchaseTime");
    return this.get("dateService").timestampToTime(purchaseTimeDate);
  }),
  purchaseTimeStr:Ember.computed('purchaseTime',function(){
    var purchaseTime = this.get("purchaseTime");
    return purchaseTime?this.get("dateService").formatDate(purchaseTime, "yyyy-MM-dd"):null;
  }),
});
