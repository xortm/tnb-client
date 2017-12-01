import DS from 'ember-data';
import BaseModel from './base-model';

export default BaseModel.extend({
  mobile:DS.attr('string'),//手机号
  code:DS.attr('number'),//验证码
  password:DS.attr('string'),//密码
  type:DS.attr('string'),//类型
});
