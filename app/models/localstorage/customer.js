import DS from 'ember-data';
import Ember from 'ember';
/*客户*/
var Customer = DS.Model.extend({
  code: DS.attr('string'),
  desc: DS.attr('string'),
  name: DS.attr('string'),
  type: DS.attr('number'),//类型
  sex: DS.attr('number'),//性别,1男2女
  phone: DS.attr('number'),//电话号码
  email: DS.attr('string'),//邮箱
  weixin:DS.attr('string'),//微信号
  address:DS.attr('string'),//地址
  task: DS.belongsTo('task'),//此客户所属任务
});
Customer.reopenClass({
  FIXTURES: [
    {
      id: 1,
      code: "001",
      name: "张静",
      sex:1,
      phone:13502348699,
      address:"北京海淀区中关村",
      weixin:"13502348699",
      email:"zhangjing@sina.com"
    },
    {
      id: 2,
      code: "002",
      name: "王里影",
      sex:0,
      phone:13702342923,
    },
    {
      id: 3,
      code: "003",
      name: "尤建恒",
      sex:1,
      phone:13302679279,
    },
  ]
});
export default Customer;
