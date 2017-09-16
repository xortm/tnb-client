import Model from 'ember-data/model';
import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';
const { accountType_weixin,accountType_zhifubao,accountType_card,payStatus_processing,payStatus_complete,payStatus_fail,payStatus_not} = Constants;

export default BaseModel.extend({
  dateService: Ember.inject.service('date-service'),
  statusService: Ember.inject.service("current-status"),
  pathConfiger: Ember.inject.service("path-configer"),

  code: DS.attr('string'),//订单号
  user: DS.belongsTo('user'),//用户
   amount: DS.attr('number'),//到账金额
  sysAccount: DS.attr('string'),//系统账户（呼叫云）
  sysAccountType: DS.attr('number'),//系统账户类型  1：微信 2：支付宝 3：银行卡
  userAccount: DS.attr('string'),//用户账户
  userAccountType: DS.attr('number'),//用户账户类型  1：微信 2：支付宝 3：银行卡
   payType: DS.attr('number'),//支付类型 1：充值  2：提现
  payChannel: DS.attr('number'),//支付渠道 1：微信 2：支付宝 3：银行卡
  payTime: DS.attr('number'),//支付时间
   payStatus: DS.attr('number'),//支付状态 0正在处理 1支付完成 2支付失败 3未支付
  failReason: DS.attr('string'),//失败原因
  createTime: DS.attr('number'),//创建时间
   remark: DS.attr('string'),//备注
  errcode:DS.attr('number'),//错误类型
  wechatQrPay:DS.attr('string'),//微信支付二维码

  amountRounded:Ember.computed('amount',function(){
    var Dight = this.get('amount');
    // Dight = Math.round(Dight*Math.pow(10,2))/Math.pow(10,2);
    Dight = Dight.toFixed(2);
    console.log('dight of the amount',Dight);
    return Dight;
  }),
  payTimeStr:Ember.computed('payTime',function(){
    var payTime = this.get('payTime');
    console.log('payTime get in model',payTime);
    if(payTime === undefined){
      return ' ';
    }
    else{
      var str = this.get("dateService").formatDate(payTime,"yyyy-MM-dd hh:mm");
      console.log('str get in pay-record model',str);
      return str;
    }
  }),
  createTimeStr:Ember.computed('createTime',function(){
    var _self = this;
    var str = _self.get("dateService").formatDate(_self.get("createTime"),"yyyy-MM-dd hh:mm");
    console.log('str get in pay-record model',str);
    return str;
  }),
  userAccountTypeStr:Ember.computed('userAccountType',function(){
    var userAccountType = this.get('userAccountType');
    if(userAccountType === accountType_weixin){
      return '微信';
    }
    else if(userAccountType === accountType_zhifubao){
      return '支付宝';
    }
    else if(userAccountType === accountType_card){
      return '银行卡';
    }
  }),
  payChannelStr:Ember.computed('payChannel',function(){
    var payChannel = this.get('payChannel');
    if(payChannel === accountType_weixin){
      return '微信';
    }
    else if(payChannel === accountType_zhifubao){
      return '支付宝';
    }
    else if(payChannel === accountType_card){
      return '银行卡';
    }
  }),
  payStatusStr:Ember.computed('payStatus',function(){
    var payStatus = this.get('payStatus');
    if(payStatus === payStatus_processing){
      return '正在处理';
    }
    else if(payStatus === payStatus_complete){
      return '支付完成';
    }
    else if(payStatus === payStatus_fail){
      return '支付失败';
    }
    else if(payStatus === payStatus_not){
      return '未支付';
    }
  }),
  wechatQrPayUrl:Ember.computed('wechatQrPay',function(){
      var wechatQrPay = this.get("wechatQrPay");
      console.log("this.pathConfiger",wechatQrPay);
      return this.get("pathConfiger").getwechatQrPayRemotePath(wechatQrPay);
  }),
});
