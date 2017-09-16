import DS from 'ember-data';

export default DS.Model.extend({
  token:DS.attr('string'),//登录后获得的令牌
  user: DS.belongsTo('user'),//当前用户
  loginTime:DS.attr('date'),//此次登录的时间
  loginName:DS.attr('string'),
  password:DS.attr('string'),
});
