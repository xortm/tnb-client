import DS from 'ember-data';
import User from './user';
export default User.extend({
  token:DS.attr('string'),//登录后获得的令牌
  // user: DS.belongsTo('user'),//当前用户
  // loginTime:DS.attr('date'),//此次登录的时间
  // loginName:DS.attr('string'),
  password:DS.attr('string'),
  newPassword:DS.attr('string'),
  authCode: DS.attr('string'),//验证码
  errcode: DS.attr('number'),//错误类型，0：验证码错误
  oldToken:DS.attr('string')//上一次登录令牌
});
