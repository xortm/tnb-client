import DS from 'ember-data';
import Ember from 'ember';
import BaseModel from './base-model';

export default BaseModel.extend({
  pathConfiger: Ember.inject.service("path-configer"),

  code: DS.attr('string'),
  user: DS.belongsTo('user'),
  openid:DS.attr('string'),//
  qrUrl:DS.attr('string'),//绑定二维码相对地址
  nickname:DS.attr('string'),//昵称
  sex:DS.attr('number'),//性别 1男2女
  language:DS.attr('string'),
  city:DS.attr('string'),
  province:DS.attr('string'),
  country:DS.attr('string'),
  headimgurl:DS.attr('string'),//头像地址
  bindStatus:DS.attr('number'),//0 未绑定   1 已绑定
  createTime:DS.attr('number'),
  updateTime:DS.attr('number'),

  AbsoluteqrUrl:Ember.computed('qrUrl',function(){
      var qrUrl = this.get("qrUrl");
      return this.get("pathConfiger").getwechatQrPayRemotePath(qrUrl);
  }),
});
