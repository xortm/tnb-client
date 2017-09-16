import DS from 'ember-data';

export default DS.Model.extend({
  code:DS.attr('string'),//编码
  ims:DS.attr('string'),//号码
  imsKey:DS.attr('string'),//秘钥
  imsPasswd:DS.attr('string'),//密码
  statusIms:DS.attr('string'),//华为号码状态  0 空闲   1  在用   2 预删除
  status:DS.attr('number'),// 0 可用  1 已被使用
  isBuy:DS.attr('number'),//0 未订购套餐   1 已订购套餐
  remark:DS.attr('string'),// 备注
});
