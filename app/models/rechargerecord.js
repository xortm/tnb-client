import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
/*客户*/
var Recharge = BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),
  dateService: Ember.inject.service("date-service"),
  createDateTime: DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime: DS.attr('number'),//更改时间
  lastUpdateUser:DS.belongsTo('user'),//更改者id
  remark:DS.attr('string'),//备注
  channel:DS.belongsTo('dicttype'),//充值方式( rechargeChannel)
  rechargeAccount:DS.belongsTo('tradeaccount'),//充值账户id
  gatherAccount:DS.belongsTo('tradeaccount'),//收款账户id
  money:DS.attr('string'),//充值金额
  rechargeInfo:DS.attr('string'),//充值账号信息(微信支付宝或其他信息)
  operateUser:DS.belongsTo('user'),//审核人
  operateTime: DS.attr('number'),//审核时间
  rechargeStatus:DS.belongsTo('dicttype'),//记录状态(rechargeStatus)
  createDate:Ember.computed("createDateTime",function(){
      var createDateTime=this.get("createDateTime");
      return this.get("dateService").timestampToTime(createDateTime);
  }),
  createDateString:Ember.computed("createDateTime",function(){
    var createDateTime=this.get("createDateTime");
    return this.get("dateService").formatDate(createDateTime,"yyyy-MM-dd");

  }),
});
export default Recharge;
