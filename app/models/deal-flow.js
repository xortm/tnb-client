import Model from 'ember-data/model';
import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
const {withdraw_Cash} = Constants;
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  statusService: Ember.inject.service("current-status"),
  code: DS.attr('string'),
  payer: DS.belongsTo('user'), //付款方,
  payee: DS.belongsTo('user'), //收款方,
  initiator: DS.belongsTo('user'), //发起人,
  amount: DS.attr('number'),//金额,
  payerBalance: DS.attr('number'),//付款方余额
  payeeBalance: DS.attr('number'),//收款方余额
  businessType: DS.belongsTo('dicttype'),//交易类型
  payRecord: DS.belongsTo('pay-record'),//充值/提现记录
  task: DS.belongsTo('task'),//任务
  tradeTime: DS.attr('number'),//交易时间
  createTime: DS.attr('number'),//创建时间
  remark: DS.attr('string'),//备注

  tradeTimeStr:Ember.computed('tradeTime',function(){
    var _self = this;
    var str = _self.get("dateService").formatDate(_self.get("tradeTime"),"yyyy-MM-dd hh:mm");
    console.log('str get in deal-flow model',str);
    return str;
  }),
  curBalance:Ember.computed('payerBalance','payeeBalance',function(){
    var _self = this;
    console.log('_self.statusService.getUser',_self.get('statusService').getUser());
    if(_self.get('statusService').getUser().get('id') === _self.get('payer').get('id')){
      return _self.get('payerBalance');
    }
    else{
      return _self.get('payeeBalance');
    }
  }),
});
