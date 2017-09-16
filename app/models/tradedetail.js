import DS from 'ember-data';
import BaseModel from './base-model';

var Tradedetail = BaseModel.extend({
  dateService: Ember.inject.service("date-service"),
  createDateTime:DS.attr('number'),//创建时间
  createUser:DS.belongsTo('user'),//创建人
  lastUpdateDateTime:DS.attr('number'),//更新时间
  lastUpdateUser:DS.belongsTo('user'),//更新人
  remark:DS.attr('string'),//备注
  payAccount:DS.belongsTo('tradeaccount'),//付款账户
  gatherAccount:DS.belongsTo('tradeaccount'),//收款账户
  money:DS.attr('number'),//金额
  type:DS.belongsTo('dicttype'),//消费类型
  balance:DS.attr('number'),//账户余额
  enSurebalance:DS.attr('number'),//保证金账户余额
  createTime:Ember.computed("createDateTime",function(){
    let create = this.get("createDateTime");
    return this.get("dateService").formatDate(create,"yyyy-MM-dd hh:mm:ss");
  }),
});

export default Tradedetail;
