
import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  code: DS.attr('string'),//编码
  recharge: DS.attr('string'),//总充值金额
  cardNumber: DS.attr('string'),//银行卡号
  zhifubao: DS.attr('string'),//支付宝
  weixin: DS.attr('string'),//微信
  income: DS.attr('number'),//收入金额
  spending: DS.attr('number'),//支出
  balance: DS.attr('number'),//余额
  withdrawDeposit: DS.attr('number'),//总提现金额总提现金额
  user:DS.belongsTo('user'),//用户
  bindType:DS.attr('number'),//绑定类型
  createTime:DS.attr('number'),//创建时间
  updateTime:DS.attr('number'),//更新时间
  callCost:DS.attr('number'),//通话费用
  freezingAmount:DS.attr('number'),//任务未结算，冻结金额
  // status:
  remark: DS.attr('string'),//备注
});
