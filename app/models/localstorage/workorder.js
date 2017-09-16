import DS from 'ember-data';
import Ember from 'ember';

/*工单*/
var Workorder = DS.Model.extend({
  code: DS.attr('string'),
  title: DS.attr('string'),//工单标题
  type: DS.attr('number'),//类型
  desc: DS.attr('string'),//描述信息
  isSuccess:DS.attr('boolean'),//是否成单
  followTime:DS.attr('date'),//跟进日期
  createTime:DS.attr('date'),//创建时间
  customer: DS.belongsTo('customer'), //对应客户
  call: DS.belongsTo('call'),//对应通话

  followTimeShow: function() {
    var format = "yyyy-MM-dd";
    return moment(this.followTime).format(format);
  },
  createTimeShow: function() {
    var format = "yyyy-MM-dd";
    return moment(this.createTime).format(format);
  },
});
Workorder.reopenClass({
  FIXTURES: [
    {
      id: 1,
      code: "001",
      title: "用户要求送件",
      desc:"一个大件，一个小件",
      customer:1,
      call:1
    }
  ]
});
export default Workorder;
